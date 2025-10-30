import "./AboutPage.css";

function AboutPage() {
  return (
    <div className="about-container" style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>👋 About BuddyCart</h1>

      <div className="about-section" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.5rem" }}>
        <img
          src="/images/your-photo.jpg"
          alt="Yang Yanqing"
          style={{
            width: "220px",
            height: "220px",
            objectFit: "cover",
            borderRadius: "50%",
            border: "4px solid #ddd",
          }}
        />
        <div style={{ flex: 1, minWidth: "250px" }}>
          <h2>🛍️ What is BuddyCart?</h2>
          <p>
            <strong>BuddyCart</strong> is where <strong>shopping meets chatting</strong>, and personality meets
            technology. It’s a full-stack web app built to make online shopping <strong>social, interactive,
            and personal</strong>.
          </p>
          <p>
            Imagine walking through a lively European street market — but online:
          </p>
          <ul>
            <li>🛒 Browse new products</li>
            <li>💬 Chat with friends in real time</li>
            <li>👗 Get advice on your fashion vibe</li>
            <li>🎨 Watch your homepage color evolve with your clicks</li>
          </ul>
          <p>
            Whether you’re an <strong>introvert or extrovert</strong>, a <strong>social butterfly 🦋</strong> or a{" "}
            <strong>quiet thinker 🤫</strong>, BuddyCart creates a digital reflection of your mood and personality.
          </p>
        </div>
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <div className="idea-section">
        <h2>💡 The Idea</h2>
        <p>
          Shopping online often feels lonely — you scroll, you buy, and that’s it.
          <br />
          <strong>BuddyCart</strong> changes that. It turns shopping into a shared experience where your friends can
          comment, react, and help you choose.
        </p>
        <p>
          And because every click says something about your taste, BuddyCart’s{" "}
          <strong>Color Engine</strong> slowly transforms your homepage into your emotional signature.
        </p>
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <div className="creator-section">
        <h2>🧑‍💻 About the Creator</h2>
        <p>
          <strong>👤 Yang Yanqing (杨彦青)</strong> — Full-stack developer · Economist · Cultural bridge-builder 🌏
        </p>
        <ul>
          <li>🎓 PhD Researcher based in <strong>Madrid, Spain</strong></li>
          <li>💼 10+ years of experience in international trade, data analysis & digital innovation</li>
          <li>💻 Exploring how AI and full-stack development make digital life more human</li>
          <li>❤️ Passionate about technology, design, and intercultural creativity</li>
        </ul>
        <blockquote style={{ fontStyle: "italic", color: "#666" }}>
          “I believe every great product is not just about code — it’s about emotion, connection, and curiosity.”
        </blockquote>
        <p>📍 Lives between Madrid 🇪🇸 and Europe’s digital spaces.</p>
        <p>☕ Loves green tea, good coffee, and a touch of chaos.</p>
        <p>🎵 Favorite music: Joe Hisaishi & Claude Debussy.</p>
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <div className="vision-section">
        <h2>🧭 Vision</h2>
        <p>
          <strong>BuddyCart</strong> isn’t just a project — it’s an experiment in digital identity.
          It explores how small online actions — like liking a product or chatting with a friend — can reflect who we are.
        </p>
        <p>
          It’s shopping, but with personality.<br />
          It’s social, but genuine.<br />
          It’s code, but human.
        </p>
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "1.1rem" }}>
          Built with ☕ + 💡 + 💻 by <strong>Yanqing</strong>.
        </p>
        <p>
          <em>“Shop. Chat. Be yourself.” — BuddyCart</em>
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
