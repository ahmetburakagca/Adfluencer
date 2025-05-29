import { useEffect, useState } from "react";
import { Users, Code2, BookOpen, CircleUserRound } from "lucide-react";

const teamMembers = [
  {
    name: "Ali Baran Demir",
    role: "Proje Sahibi",
    description: "Backend Geliştirici",
  },
  {
    name: "Ahmet Burak Ağca",
    role: "Proje Sahibi",
    description: "Backend Geliştirici",
  },
  {
    name: "Doğukan Öztürk",
    role: "Proje Sahibi",
    description: "Frontend Geliştirici",
  },
];
const technologies = [
  {
    name: "React",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png",
    description: "Frontend Framework",
  },
  {
    name: ".NET Core",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/.NET_Core_Logo.svg/1200px-.NET_Core_Logo.svg.png",
    description: "Backend Framework",
  },
  {
    name: "MSSQL",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
    description: "Veritabanı",
  },
  {
    name: "Docker",
    logo: "https://www.docker.com/wp-content/uploads/2022/03/vertical-logo-monochromatic.png",
    description: "Containerization",
  },
  {
    name: "Tailwind CSS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2048px-Tailwind_CSS_Logo.svg.png",
    description: "CSS Framework",
  },
  {
    name: "TypeScript",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png",
    description: "JavaScript Superset",
  },
  {
    name: "Git",
    logo: "https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png",
    description: "Version Control",
  },
  {
    name: "Azure",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Microsoft_Azure.svg/1200px-Microsoft_Azure.svg.png",
    description: "Cloud Platform",
  },
];
const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-700 text-white">
      <section className="relative min-h-[60vh] flex items-center py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-white/10 rounded-full filter blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1
              className={`text-5xl md:text-7xl font-extrabold mb-6 leading-tight transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              Hakkımızda
            </h1>
            <p
              className={`text-xl md:text-2xl text-white/90 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              Bu proje, Ege Üniversitesi Bilgisayar Mühendisliği bölümü
              öğrencileri tarafından geliştirilen bir tez projesidir.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Proje Ekibi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={` rounded-xl p-6 transition-all duration-1000`}
              >
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-2xl font-bold">
                    <CircleUserRound className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-purple-200 mb-2">{member.role}</p>
                  <p className="text-white/80">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Kullanılan Teknolojiler
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className={`bg-white/10 rounded-xl p-6 backdrop-blur-sm transition-all duration-1000 delay-${
                  index * 100
                } ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <img
                      src={tech.logo}
                      alt={tech.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{tech.name}</h3>
                  <p className="text-white/80">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`bg-white/10 rounded-xl p-6 backdrop-blur-sm transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 mb-4">
                <Code2 className="w-6 h-6 text-purple-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Teknoloji</h3>
              <p className="text-white/80">
                Modern web teknolojileri kullanılarak geliştirilmiş,
                ölçeklenebilir ve güvenli bir platform. .NET Core, React,
                Tailwind CSS, Docker, MSSQL, Azure, Git, TypeScript
                kullanılmıştır.
              </p>
            </div>
            <div
              className={`bg-white/10 rounded-xl p-6 backdrop-blur-sm transition-all duration-1000 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 mb-4">
                <BookOpen className="w-6 h-6 text-purple-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tez Projesi</h3>
              <p className="text-white/80">
                Ege Üniversitesi Bilgisayar Mühendisliği bölümü tez projesi
                olarak geliştirilmiştir.
              </p>
            </div>
            <div
              className={`bg-white/10 rounded-xl p-6 backdrop-blur-sm transition-all duration-1000 delay-400 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 mb-4">
                <Users className="w-6 h-6 text-purple-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ekip</h3>
              <p className="text-white/80">
                Ege Üniversitesi Bilgisayar Mühendisliği bölümü öğrencileri
                tarafından geliştirilmiştir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
