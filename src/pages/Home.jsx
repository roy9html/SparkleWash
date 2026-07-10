import Hero from "../components/Hero";
import ServiceCard from "../components/ServiceCard";

function Home() {
  const services = [
    {
      id: 1,
      title: "Basic Wash",
      description: "Exterior cleaning",
      price: "KES 500",
    },
    {
      id: 2,
      title: "Premium Wash",
      description: "Interior and exterior cleaning",
      price: "KES 1200",
    },
    {
      id: 3,
      title: "Full Detailing",
      description: "Complete detailing package",
      price: "KES 2500",
    },
  ];

  return (
    <>
      <Hero />

      <section>
        <h2>Our Popular Services</h2>

        {services.map((service) => (
          <ServiceCard
            key={service.id}
            title={service.title}
            description={service.description}
            price={service.price}
          />
        ))}
      </section>
    </>
  );
}

export default Home;