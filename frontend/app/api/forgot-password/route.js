export async function POST(req) {
    const body = await req.json();
    try {
      const res = await fetch('https://fullwash.online/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
  
      if (!res.ok) {
        const error = await res.json();
        return new Response(JSON.stringify(error), { status: res.status });
      }
  
      return new Response(JSON.stringify({ message: 'Correo enviado' }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500 });
    }
  }
  