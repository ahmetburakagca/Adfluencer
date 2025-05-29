import { Star } from "lucide-react";

type TestimonialCardProps = {
  content: string;
  avatar: string;
  name: string;
  position: string;
};

const TestimonialCard = ({
  content,
  avatar,
  name,
  position,
}: TestimonialCardProps) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
      <div className="flex mb-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-gray-700 mb-6 italic text-lg">{content}</p>
      <div className="flex items-center">
        <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden mr-4 border-2 border-primary">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">{name}</p>
          <p className="text-gray-500">{position}</p>
        </div>
      </div>
    </div>
  );
};

export const TestimonialsSection = () => {
  const testimonials = [
    {
      content:
        "Adfluencer sayesinde markamıza en uygun influencer'ları bulmamız çok kolay oldu. Kampanyalarımızın getirisi önemli ölçüde arttı.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      name: "Ayşe Yılmaz",
      position: "Pazarlama Müdürü, TechBrand",
    },
    {
      content:
        "Bir influencer olarak, Adfluencer platformu bana harika iş fırsatları sunuyor. Markalarla anlaşma sürecini çok kolaylaştırıyor.",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      name: "Mehmet Kaya",
      position: "İçerik Üreticisi, 500K+ Takipçi",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center py-1.5 px-4 rounded-full bg-yellow-100 text-yellow-700 font-medium text-sm mb-4">
            <Star className="w-4 h-4 mr-2" />
            Müşteri Memnuniyeti
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Müşterilerimiz Ne Diyor?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Platformumuz üzerinden başarılı işbirlikleri gerçekleştiren
            kullanıcılarımızın deneyimleri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard
              key={idx}
              content={testimonial.content}
              avatar={testimonial.avatar}
              name={testimonial.name}
              position={testimonial.position}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
