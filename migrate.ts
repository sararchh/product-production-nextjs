import { getDatabase } from './src/lib/database';

async function migrateData() {
  console.log('🚀 Iniciando migração de dados...');
  
  try {
    const database = getDatabase();
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sampleProduct = {
      id: "1752095372059",
      name: "TESTE",
      description: "",
      price: 0,
      minProduction: 10,
      maxProduction: 52,
      active: true,
      createdAt: "2025-07-09T21:09:32.059Z",
      updatedAt: "2025-07-09T21:09:32.060Z"
    };

    console.log('📦 Inserindo produto de exemplo...');
    await database.createProduct(sampleProduct);
    console.log('✅ Produto de exemplo inserido com sucesso!');
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('UNIQUE constraint failed')) {
      console.log('ℹ️  Produto já existe no banco de dados');
    } else {
      console.error('❌ Erro ao inserir produto:', errorMessage);
    }
  }

  console.log('🎉 Migração concluída!');
  process.exit(0);
}

migrateData().catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('💥 Erro na migração:', errorMessage);
  process.exit(1);
});
