import { NextRequest, NextResponse } from 'next/server';
import { LoginRequest, LoginResponse } from '@/modules/auth';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;

    if (username === 'iforth.development.test' && password === 'famosaSenha123') {
      const response: LoginResponse = {
        success: true,
        token: `fake-jwt-token-${Date.now()}`,
        user: {
          id: '1',
          username: 'iforth.development.test',
          name: 'Usuário de Teste'
        }
      };

      return NextResponse.json(response, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
