const menuBtn = document.getElementById("menuBtn");
const navPanel = document.getElementById("navPanel");
const navItems = [...document.querySelectorAll(".section-links a")];
const sections = [...document.querySelectorAll("main section[id]")];
const yearEl = document.getElementById("year");
const navbar = document.querySelector(".navbar");
const themeToggle = document.getElementById("themeToggle");
const revealTargets = document.querySelectorAll(".reveal-target");
const faqQuestions = document.querySelectorAll(".faq-question");
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
    const nextMode = theme === "light" ? "dark" : "light";
    const label = `Switch to ${nextMode} mode`;
    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("data-tooltip", label);
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

faqQuestions.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    if (!item) return;
    const isOpen = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

const onScroll = () => {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 12);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const metaSupabaseUrl = document
  .querySelector('meta[name="portfolio-supabase-url"]')
  ?.getAttribute("content");
const metaSupabaseAnonKey = document
  .querySelector('meta[name="portfolio-supabase-anon-key"]')
  ?.getAttribute("content");
const metaSupabaseTable = document
  .querySelector('meta[name="portfolio-supabase-table"]')
  ?.getAttribute("content");

const SUPABASE_URL =
  typeof metaSupabaseUrl === "string" ? metaSupabaseUrl.trim().replace(/\/$/, "") : "";
const SUPABASE_ANON_KEY =
  typeof metaSupabaseAnonKey === "string" ? metaSupabaseAnonKey.trim() : "";
const SUPABASE_TABLE =
  typeof metaSupabaseTable === "string" && metaSupabaseTable.trim()
    ? metaSupabaseTable.trim()
    : "contact_messages";

if (contactForm && contactFeedback) {
  const pulseContactFeedback = (kind) => {
    if (prefersReducedMotion) return;
    contactFeedback.classList.remove("feedback-shake", "feedback-pop");
    void contactFeedback.offsetWidth;
    if (kind === "error") {
      contactFeedback.classList.add("feedback-shake");
    }
    if (kind === "success") {
      contactFeedback.classList.add("feedback-pop");
    }
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      contactFeedback.textContent = "Please fill out all fields.";
      contactFeedback.classList.add("is-error");
      contactFeedback.classList.remove("is-success");
      pulseContactFeedback("error");
      return;
    }

    if (contactSubmitBtn) {
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.textContent = "Sending...";
    }

    contactFeedback.textContent = "";
    contactFeedback.classList.remove("is-error", "is-success", "feedback-shake", "feedback-pop");

    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error("Contact form is not configured yet. Please add Supabase credentials.");
      }

      const response = await fetch(`${SUPABASE_URL}/rest/v1/${encodeURIComponent(SUPABASE_TABLE)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify([payload]),
      });

      if (!response.ok) {
        let errorMessage = "Failed to save your message.";
        try {
          const errorData = await response.json();
          const details = [errorData?.message, errorData?.details, errorData?.hint]
            .filter((value) => typeof value === "string" && value.trim())
            .join(" ");
          if (details) {
            errorMessage = details;
          }
        } catch (_error) {
          // Keep generic message if response body is not JSON.
        }
        throw new Error(errorMessage);
      }

      contactForm.reset();
      contactFeedback.textContent = "Message sent successfully. Thank you!";
      contactFeedback.classList.add("is-success");
      pulseContactFeedback("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send message. Please try again.";
      contactFeedback.textContent = message;
      contactFeedback.classList.add("is-error");
      pulseContactFeedback("error");
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

document.querySelectorAll(".timeline-expand").forEach((btn) => {
  const panelId = btn.getAttribute("aria-controls");
  if (!panelId) return;
  const panel = document.getElementById(panelId);
  if (!panel) return;

  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    const next = !isOpen;
    btn.setAttribute("aria-expanded", String(next));
    panel.classList.toggle("is-open", next);
    panel.setAttribute("aria-hidden", next ? "false" : "true");
    btn.setAttribute("aria-label", next ? "Hide responsibilities" : "Show responsibilities");
  });
});

document.querySelectorAll(".project-expand").forEach((btn) => {
  const panelId = btn.getAttribute("aria-controls");
  if (!panelId) return;
  const panel = document.getElementById(panelId);
  if (!panel) return;
  const labelSpan = btn.querySelector("span");

  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    const next = !isOpen;
    btn.setAttribute("aria-expanded", String(next));
    panel.classList.toggle("is-open", next);
    panel.setAttribute("aria-hidden", next ? "false" : "true");
    btn.setAttribute("aria-label", next ? "Hide project details and tools" : "Show project details and tools");
    if (labelSpan) {
      labelSpan.textContent = next ? "Hide details and tools" : "Show details and tools";
    }
  });
});