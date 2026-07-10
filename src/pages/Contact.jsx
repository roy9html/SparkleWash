function Contact() {
  return (
    <section>
      <h1>Contact Us</h1>

      <form>
        <div>
          <label>Name</label>
          <br />
          <input type="text" placeholder="Enter your name" />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input type="email" placeholder="Enter your email" />
        </div>

        <br />

        <div>
          <label>Message</label>
          <br />
          <textarea
            rows="5"
            placeholder="Write your message here..."
          ></textarea>
        </div>

        <br />

        <button type="submit">Send Message</button>
      </form>
    </section>
  );
}

export default Contact;