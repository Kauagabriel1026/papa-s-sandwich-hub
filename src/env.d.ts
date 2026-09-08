/// <reference types="vite/client" />

/**
 * Declara as variáveis de ambiente do projeto.
 *
 * Sem isto, o TypeScript trata `import.meta.env.VITE_SUPABASE_URL` como acesso
 * a um índice genérico e o projeto (que usa `noPropertyAccessFromIndexSignature`)
 * recusa a compilação. A saída fácil seria escrever com colchetes,
 * `import.meta.env["VITE_SUPABASE_URL"]` — mas aí o Vite deixa de substituir o
 * valor na hora do build, porque ele só reconhece o acesso por ponto. O
 * resultado é silencioso e traiçoeiro: compila, publica, e as variáveis chegam
 * vazias no navegador.
 *
 * Declarar os nomes aqui resolve os dois lados de uma vez.
 */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
