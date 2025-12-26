/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    // Forward the request to the n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: body.nombre,
        correo: body.correo,
        pedido: body.pedido,
        timestamp: body.timestamp || new Date().toISOString(),
      }),
    });

    console.log("n8n webhook response status:", response.status);

    const responseText = await response.text();
    console.log("n8n webhook response:", responseText);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Pedido enviado correctamente" 
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
        error: "Error al procesar el pedido" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
