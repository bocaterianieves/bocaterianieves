/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const N8N_WEBHOOK_URL = "https://orderflowagency.app.n8n.cloud/webhook/c2ec1314-5b35-43a9-a5e3-99cb0efe90d6";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    console.log("Received order data:", JSON.stringify(body));

    const payload = {
      nombre: body.nombre,
      correo: body.correo,
      pedido: body.pedido,
      fechaRecogida: body.fechaRecogida,
      horaRecogida: body.horaRecogida,
      timestamp: body.timestamp || new Date().toISOString(),
    };

    // 1) Try POST (recommended)
    let response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let responseText = await response.text();

    console.log("n8n webhook response status:", response.status);
    console.log("n8n webhook response:", responseText);

    // 2) If n8n webhook is configured for GET-only, retry as GET.
    if (
      response.status === 404 &&
      responseText.includes("not registered for POST")
    ) {
      console.log("Webhook seems GET-only; retrying with GET query params");

      const url = new URL(N8N_WEBHOOK_URL);
      url.search = new URLSearchParams({
        nombre: String(payload.nombre ?? ""),
        correo: String(payload.correo ?? ""),
        pedido: String(payload.pedido ?? ""),
        fechaRecogida: String(payload.fechaRecogida ?? ""),
        horaRecogida: String(payload.horaRecogida ?? ""),
        timestamp: String(payload.timestamp ?? ""),
      }).toString();

      response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      responseText = await response.text();

      console.log("n8n webhook (GET retry) status:", response.status);
      console.log("n8n webhook (GET retry) response:", responseText);
    }

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "El webhook devolvió un error",
          upstream_status: response.status,
          upstream_body: responseText,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 502,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Pedido enviado correctamente",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing order:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Error al procesar el pedido",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
