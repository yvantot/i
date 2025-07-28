import { Utils } from "./utils.js";

class EntryLinks extends HTMLElement {
	constructor() {
		super();
		this.favicon_api = "https://www.google.com/s2/favicons?sz=64&domain=";
	}

	connectedCallback() {
		let links = this.getAttribute("entry-links");
		if (!links) {
			this.remove();
			return;
		}

		links = links.split("|");

		const container = Utils.create_element("div", { class: "links" });
		for (let link of links) {
			const [url, icon] = link.split(";");
			if (url) {
				const a = Utils.create_element("a", { href: url, target: "_blank" });
				const img = Utils.create_element("img", { loading: "lazy" });

				if (icon) img.src = icon;
				else img.src = this.favicon_api + new URL(url).hostname;

				a.append(img);
				container.append(a);
			}
		}
		this.append(container);
	}
}

class Entry extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		// Passing native null value as an attribute to <entry-links> as its attribute will make the null value to "null"
		// so instead use ?? "" to make it a falsy value
		const links = this.getAttribute("entry-links") ?? "";

		const title = this.getAttribute("app-title");
		const name = this.getAttribute("app-name");
		const description = this.getAttribute("app-description");
		const medias = this.getAttribute("app-media") ? this.getAttribute("app-media").split("|") : null;
		const media_path = "./images/ss/" + medias[0];
		const is_link = /\.com/.test(medias[0]);

		this.innerHTML = `
            <p class="huge-text" target="_blank">${title}</p>            
            <div class="app-info">
				<div class="info">                    
					<p class="name">${name}</p>
					<p class="description">${description}</p>    
					<entry-links entry-links="${links}"></entry-link>
				</div>				
				<div class="screenshots" style="background-image: url('${medias && is_link === false ? media_path : ""}')">					
					${is_link ? `<iframe src="${medias[0]}" loading='lazy'></iframe>` : ""}

					<div class="ss-count">
						<span>1</span>
						<span>/</span>
						<span>${medias.length}</span>
					</div>
					<div class="ss-actions">
						<button data-action="ss-previous" class="${medias.length > 1 ? "" : "no-display"}">
							<svg>
								<use href="#previous"></use>
							</svg>
						</button>
						<button data-action="ss-zoom">
							<svg>
								<use href="#zoom"></use>
							</svg>
						</button>					
						<button data-action="ss-next" class="${medias.length > 1 ? "" : "no-display"}">
							<svg>
								<use href="#next"></use>
							</svg>
						</button>
					</div>							
				</div>                      
            </div> 
        `.trim();
	}
}

class Index {
	constructor() {
		this.coloredHover = null;
		this.screenshotHover = null;
	}

	init() {
		document.addEventListener("click", (event) => this.handleClick(event));
		document.addEventListener("mouseover", (event) => this.handleMouseover(event));
		document.addEventListener("mousemove", (event) => this.handleMousemove(event));
	}

	handleMousemove(event) {
		if (this.screenshotHover) {
			this.screenshotHover.style.backgroundSize = "contain";
			this.screenshotHover.style.backgroundPositionY = "center";
			this.screenshotHover.style.backgroundPositionX = "center";
		}
		const target = event.target.closest(".screenshots");
		if (!target) return;
		const is_zoom_on = target.dataset?.is_zoom_on === "true" ? true : false;
		if (!is_zoom_on) return;

		if (target.classList.contains("screenshots")) {
			this.screenshotHover = target;

			const rect = target.getBoundingClientRect();
			const offset_y = Math.max(0, Math.min(100, ((event.y - rect.y) / rect.height) * 100));
			const offset_x = Math.max(0, Math.min(100, ((event.x - rect.x) / rect.width) * 100));
			const zoomFactor = 1000 / rect.width;
			const bgWidth = rect.width * zoomFactor;

			target.style.backgroundSize = bgWidth + "px";
			target.style.backgroundPositionY = offset_y + "%";
			target.style.backgroundPositionX = offset_x + "%";
		}
	}

	handleMouseover(event) {
		if (this.coloredHover && !this.coloredHover.classList.contains("click-entry")) {
			this.coloredHover.classList.remove("make-entry-hovered");
			this.coloredHover.style.backgroundColor = "";
		}

		const target = event.target.closest("make-entry");
		if (!target) return;

		if (target.classList.contains("click-entry")) return;

		const bgcolor = target.getAttribute("app-color") ?? "teal";
		target.style.backgroundColor = bgcolor;
		target.classList.add("make-entry-hovered");
		this.coloredHover = target;
	}

	handleClick(event) {
		const target = event.target.closest("make-entry, entries-category, button");
		if (!target) return;
		switch (target.nodeName) {
			case "BUTTON": {
				const make_entry = target.closest("make-entry");
				const ss_container = target.closest(".screenshots");
				const ss_iframe = ss_container.querySelector("iframe");
				const ss_count = ss_container.querySelector(".ss-count").children[0];
				const medias = make_entry.getAttribute("app-media").split("|");
				let ss_index = ss_container.dataset?.ss_index ? parseInt(ss_container.dataset.ss_index) : 0;

				const toggle_iframe = () => {
					const media_path = "./images/ss/" + medias[ss_index];
					if (/\.com/.test(medias[ss_index])) {
						if (ss_iframe) ss_iframe.classList.remove("no-display");
					} else {
						if (ss_iframe) ss_iframe.classList.add("no-display");

						ss_container.style.backgroundImage = `url("${media_path}")`;
					}
				};

				switch (target.dataset.action) {
					case "ss-next": {
						ss_index++;
						ss_index %= medias.length;

						toggle_iframe();

						ss_count.innerText = ss_index + 1;
						ss_container.dataset.ss_index = ss_index;

						break;
					}
					case "ss-previous": {
						ss_index--;
						if (ss_index < 0) ss_index = medias.length - 1;

						toggle_iframe();

						ss_count.innerText = ss_index + 1;
						ss_container.dataset.ss_index = ss_index;
						break;
					}
					case "ss-zoom": {
						const is_zoom_on = ss_container.dataset.is_zoom_on === "true" ? true : false;

						if (is_zoom_on) {
							ss_container.classList.remove("zoom-on");
						} else {
							ss_container.classList.add("zoom-on");
						}

						ss_container.dataset.is_zoom_on = !is_zoom_on;
						break;
					}
				}
				break;
			}
			case "MAKE-ENTRY": {
				target.classList.toggle("click-entry");
				break;
			}
			case "ENTRIES-CATEGORY": {
				let next = target.nextElementSibling;
				while (next) {
					if (next.nodeName === "MAKE-ENTRY") {
						next.classList.toggle("hide-entry");
						next.classList.remove("click-entry");
						next.style.backgroundColor = "var(--entry-bg)";
						next = next.nextElementSibling;
					} else {
						break;
					}
				}
				break;
			}
		}
	}
}

document.getElementById("topic-links").addEventListener("change", ({ target }) => {
	window.location.assign(target.value);
});

customElements.define("entry-links", EntryLinks);
customElements.define("make-entry", Entry);

customElements.define("entries-category", class extends HTMLElement {});
customElements.define("vertical-divider", class extends HTMLElement {});
customElements.define("text-entry", class extends HTMLElement {});

const index = new Index();
index.init();
