const menuBtn = document.getElementById("menuBtn");
const navPanel = document.getElementById("navPanel");
const navItems = [...document.querySelectorAll(".section-links a")];
const sections = [...document.querySelectorAll("main section[id]")];
const yearEl = document.getElementById("year");
const navbar = document.querySelector(".navbar");
const typedTextEl = document.getElementById("typedText");
const themeToggle = document.getElementById("themeToggle");
const revealTargets = document.querySelectorAll(".reveal-target");
const contactForm = document.getElementById("contactForm");
const contactSubmitBtn = document.getElementById("contactSubmitBtn");
const contactFeedback = document.getElementById("contactFeedback");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const setTheme = (theme) => {
  document.body.classList.toggle("light-theme", theme === "light");
  if (themeToggle) {
    themeToggle.setAttribute("aria-label", `Switch to ${theme === "light" ? "dark" : "light"} mode`);
  }
};

const savedTheme = localStorage.getItem("portfolio-theme");
setTheme(savedTheme === "light" ? "light" : "dark");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
  });
}

const closeMobileMenu = () => {
  if (!navPanel || !menuBtn) return;
  navPanel.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
};

if (menuBtn && navPanel) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navPanel.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    closeMobileMenu();
  });
});

document.addEventListener("click", (event) => {
  if (!navPanel || !menuBtn) return;
  if (!navPanel.classList.contains("open")) return;
  const target = event.target;
  if (!(target instanceof Node)) return;
  if (navPanel.contains(target) || menuBtn.contains(target)) return;
  closeMobileMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeMobileMenu();
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;
    event.preventDefault();
    const offset = navbar ? navbar.offsetHeight + 10 : 84;
    const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
      top: Math.max(top, 0),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
    history.replaceState(null, "", targetId);
  });
});

const updateActiveLink = (activeId) => {
  navItems.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === `#${activeId}`);
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      updateActiveLink(entry.target.id);
    });
  },
  {
    rootMargin: "-35% 0px -48% 0px",
    threshold: 0.05,
  }
);

sections.forEach((section) => sectionObserver.observe(section));

if (prefersReducedMotion) {
  revealTargets.forEach((target) => target.classList.add("in-view"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

if (typedTextEl) {
  const phrases = [
    "Programmer, Web Designer, and IT Support.",
    "Building better systems with clean, modern web solutions.",
    "Ready for a more challenging software development role.",
  ];
  if (prefersReducedMotion) {
    typedTextEl.textContent = phrases[0];
  } else {
  let phraseIndex = 0;
  let letterIndex = 0;
  let deleting = false;

  const typeLoop = () => {
    const activePhrase = phrases[phraseIndex];
    if (!deleting) {
      letterIndex += 1;
      typedTextEl.textContent = activePhrase.slice(0, letterIndex);
      if (letterIndex === activePhrase.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
      setTimeout(typeLoop, 78);
      return;
    }

    letterIndex -= 1;
    typedTextEl.textContent = activePhrase.slice(0, letterIndex);
    if (letterIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeLoop, 380);
      return;
    }
    setTimeout(typeLoop, 42);
  };

  typeLoop();
  }
}

const onScroll = () => {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 12);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const isLocalHost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.protocol === "file:";

const metaApiBase = document.querySelector('meta[name="portfolio-api-base"]')?.getAttribute("content");
const trimmedMeta =
  typeof metaApiBase === "string" ? metaApiBase.trim().replace(/\/$/, "") : "";

const API_BASE_URL =
  trimmedMeta.length > 0
    ? trimmedMeta
    : isLocalHost
      ? "http://localhost:3000"
      : "";

if (contactForm && contactFeedback) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      contactFeedback.textContent = "Please fill out all fields.";
      contactFeedback.classList.add("is-error");
      contactFeedback.classList.remove("is-success");
      return;
    }

    if (contactSubmitBtn) {
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.textContent = "Sending...";
    }

    contactFeedback.textContent = "";
    contactFeedback.classList.remove("is-error", "is-success");

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = "Request failed";
        try {
          const errorData = await response.json();
          if (typeof errorData?.error === "string" && errorData.error.trim()) {
            errorMessage = errorData.error;
          }
        } catch (_error) {
          // Keep generic message if response body is not JSON.
        }
        throw new Error(errorMessage);
      }

      contactForm.reset();
      contactFeedback.textContent = "Message sent successfully. Thank you!";
      contactFeedback.classList.add("is-success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send message. Please try again.";
      contactFeedback.textContent = message;
      contactFeedback.classList.add("is-error");
    } finally {
      if (contactSubmitBtn) {
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.textContent = "Send Message";
      }
    }
  });
}

const GITHUB_USERNAME = "reyjandellreyes21-afk";
const githubFeed = document.getElementById("githubFeed");
const githubStatus = document.getElementById("githubStatus");
const githubRefreshBtn = document.getElementById("githubRefreshBtn");

const repoName = (ev) => (typeof ev.repo?.name === "string" ? ev.repo.name : "repository");

const repoUrl = (ev) => {
  const name = repoName(ev);
  return name.includes("/") ? `https://github.com/${name}` : "https://github.com/";
};

const formatEventSummary = (ev) => {
  const repo = repoName(ev);
  switch (ev.type) {
    case "PushEvent":
      return `Pushed to ${repo}`;
    case "CreateEvent": {
      const ref = ev.payload?.ref_type ?? "resource";
      return `Created ${ref} in ${repo}`;
    }
    case "PullRequestEvent":
      return `Pull request ${ev.payload?.action ?? "updated"} on ${repo}`;
    case "IssuesEvent":
      return `Issue ${ev.payload?.action ?? "updated"} on ${repo}`;
    case "ForkEvent":
      return `Forked ${repo}`;
    case "WatchEvent":
      return `Starred ${repo}`;
    case "ReleaseEvent":
      return `Release activity on ${repo}`;
    case "DeleteEvent":
      return `Deleted ${ev.payload?.ref_type ?? "ref"} in ${repo}`;
    case "PublicEvent":
      return `Open-sourced ${repo}`;
    default:
      return `${ev.type.replace("Event", "")} on ${repo}`;
  }
};

const loadGitHubActivity = async () => {
  if (!githubFeed) return;

  githubFeed.replaceChildren();
  if (githubStatus) {
    githubStatus.textContent = "Loading recent public events…";
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/events/public?per_page=10`
    );

    if (response.status === 403) {
      throw new Error("GitHub rate limit reached. Try again in a few minutes.");
    }

    if (!response.ok) {
      throw new Error("Could not load GitHub activity.");
    }

    const events = await response.json();
    if (!Array.isArray(events) || events.length === 0) {
      if (githubStatus) {
        githubStatus.textContent = "No recent public events to show.";
      }
      return;
    }

    if (githubStatus) {
      githubStatus.textContent = "";
    }

    events.slice(0, 8).forEach((ev) => {
      const item = document.createElement("li");

      const typeEl = document.createElement("div");
      typeEl.className = "github-feed-type";
      typeEl.textContent = ev.type.replace("Event", "").toUpperCase() || "EVENT";

      const summaryEl = document.createElement("div");
      summaryEl.className = "github-feed-summary";
      summaryEl.textContent = formatEventSummary(ev);

      const metaEl = document.createElement("div");
      metaEl.className = "github-feed-meta";
      const created = ev.created_at ? new Date(ev.created_at) : null;
      const dateStr = created
        ? created.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
        : "";
      const link = document.createElement("a");
      link.href = repoUrl(ev);
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = repoName(ev);
      metaEl.append("Repository: ", link);
      if (dateStr) {
        metaEl.append(" · ", dateStr);
      }

      item.append(typeEl, summaryEl, metaEl);
      githubFeed.appendChild(item);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load GitHub activity.";
    if (githubStatus) {
      githubStatus.textContent = message;
    }
  }
};

loadGitHubActivity();

if (githubRefreshBtn) {
  githubRefreshBtn.addEventListener("click", () => {
    loadGitHubActivity();
  });
}