export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-serif mb-4">Hélène</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Massages ayurvédiques, Kobido et réflexologie à Paris.
              Une approche douce et personnalisée du bien-être.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <span className="sr-only">Instagram</span>
                {/* Instagram icon */}
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-medium mb-4">Navigation</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition">Accueil</a></li>
              <li><a href="/soins" className="hover:text-white transition">Soins</a></li>
              <li><a href="/a-propos" className="hover:text-white transition">À propos</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>123 Rue du Bien-Être</li>
              <li>75011 Paris</li>
              <li className="pt-2">
                <a href="tel:0612345678" className="hover:text-white transition">
                  06 12 34 56 78
                </a>
              </li>
              <li>
                <a href="mailto:contact@helene-massage.fr" className="hover:text-white transition">
                  contact@helene-massage.fr
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>© 2024 Hélène Massage. Tous droits réservés.</p>
          <a href="/mentions-legales" className="hover:text-white transition">
            Mentions légales
          </a>
        </div>
      </div>
    </footer>
  );
}