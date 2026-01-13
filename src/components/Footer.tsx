export function Footer() {
  return (
    // 👇 border-(--leao-amarelo)
    <footer className="bg-black border-t-4 border-(--leao-amarelo) py-8 text-center mt-auto text-gray-500">
      <div className="mb-2">
        <h2 className="text-white m-0 font-barlow text-2xl font-bold uppercase tracking-wider">
          PELO SPORT TUDO!
        </h2>
      </div>
      <p className="text-sm">
        © 2026 Departamento de Futebol de Mesa do Sport Club do Recife.
      </p>
      <div className="text-xs mt-2 opacity-70">
        Desenvolvido para a Nação Rubro-Negra 🦁
      </div>
    </footer>
  );
}