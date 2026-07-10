import heroImage from "../assets/images/hero.png";

function Hero() {
  return (
    <section>
      <div>
        <h1>Welcome to SparkleWash</h1>

        <p>
          Book professional car wash services quickly and conveniently.
        </p>

        <button>Book Now</button>
      </div>

      <div>
        <img src={heroImage} alt="SparkleWash Hero" />
      </div>
    </section>
  );
}

export default Hero;