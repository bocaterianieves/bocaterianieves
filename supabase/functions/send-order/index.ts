/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const N8N_WEBHOOK_URL = "https://pruebasorderflow.app.n8n.cloud/webhook/c2ec1314-5b35-43a9-a5e3-99cb0efe90d6";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    console.log("Received order data:", JSON.stringify(body));

    // Transformar tipoPedido al formato deseado
    const tipoPedidoFormateado = body.tipoPedido === "comer" ? "Comer Aquí" : "Para Llevar";

    // Build URL with query parameters (n8n workflow expects data in query params)
    const url = new URL(N8N_WEBHOOK_URL);
    url.searchParams.set("nombre", body.nombre || "");
    url.searchParams.set("correo", body.correo || "");
    url.searchParams.set("pedido", body.pedido || "");
    url.searchParams.set("tipoPedido", tipoPedidoFormateado);
    url.searchParams.set("fechaRecogida", body.fechaRecogida || "");
    url.searchParams.set("horaRecogida", body.horaRecogida || "");

    console.log("Sending order to n8n:", url.toString());

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseText = await response.text();

    console.log("n8n webhook response status:", response.status);
    console.log("n8n webhook response:", responseText);

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
