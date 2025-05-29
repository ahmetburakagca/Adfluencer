import { Divider } from "primereact/divider";

const footerLinks = {
  product: [
    { label: "Özellikler", href: "/features" },
    { label: "Nasıl Çalışır", href: "/pricing" },
    { label: "Vaka Çalışmaları", href: "/case-studies" },
    { label: "Değerlendirmeler", href: "/reviews" },
  ],
  company: [
    { label: "Hakkımızda", href: "/about" },
    { label: "Kariyer", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Basın", href: "/press" },
  ],
  resources: [
    { label: "Dokümantasyon", href: "/docs" },
    { label: "Yardım Merkezi", href: "/help" },
    { label: "Topluluk", href: "/community" },
    { label: "İletişim", href: "/contact" },
  ],
  legal: [
    { label: "Gizlilik", href: "/privacy" },
    { label: "Şartlar", href: "/terms" },
    { label: "Güvenlik", href: "/security" },
    { label: "Çerezler", href: "/cookies" },
  ],
};

const socialLinks = [
  { icon: "pi pi-facebook", href: "https://facebook.com", label: "Facebook" },
  { icon: "pi pi-twitter", href: "https://twitter.com", label: "Twitter" },
  {
    icon: "pi pi-instagram",
    href: "https://instagram.com",
    label: "Instagram",
  },
  { icon: "pi pi-linkedin", href: "https://linkedin.com", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <a href="/" className="inline-block">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
                Adfluencer
              </span>
            </a>
            <p className="mt-4 text-sm text-gray-600 max-w-xs">
              Markaları influencerlarla buluşturun. Gerçek sonuçlar getiren
              otantik iş birlikleri oluşturun.
            </p>
          </div>
          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-purple-700 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Divider />

        {/* Bottom Bar */}
        <div className="py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Adfluencer. Tüm hakları saklıdır.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map(({ icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-gray-600 hover:text-purple-700 transition-colors"
                  aria-label={label}
                >
                  <i className={icon} style={{ fontSize: "1.25rem" }}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
