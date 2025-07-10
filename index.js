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
				const img = Utils.create_element("img", { src: this.favicon_api + new URL(url).hostname, loading: "lazy" });

				img.onerror = function () {
					img.src = "./images/favicon-placeholder.png";
					img.onerror = null;
				};

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
		const screenshot = this.getAttribute("app-screenshot");
		const description = this.getAttribute("app-description");

		this.innerHTML = `
            <p class="huge-text" target="_blank">${title}</p>            
            <div class="app-info">
				<div class="info">                    
					<p class="name">${name}</p>
					<p class="description">${description}</p>    
					<entry-links entry-links="${links}"></entry-link>
				</div>          
				<div class="screenshots">
					<img loading="lazy" src="${screenshot}"/>
				</div>                      
            </div> 
        `.trim();
	}
}

class Index {
	constructor() {
		this.coloredHover = [];
	}

	init() {
		document.addEventListener("click", (event) => this.handleClick(event));
		document.addEventListener("mouseover", (event) => this.handleMouseover(event));
	}

	handleMouseover(event) {
		for (let e of this.coloredHover) {
			if (e.classList.contains("click-entry")) continue;
			e.style.backgroundColor = "";
		}

		const target = event.target.closest("make-entry");
		if (!target) return;
		if (target.classList.contains("click-entry")) return;
		if (target.style.backGroundColor) return;

		const color = target.getAttribute("app-color") ?? "teal";
		target.style.backgroundColor = color;
		this.coloredHover.push(target);
	}

	handleClick(event) {
		const target = event.target.closest("make-entry, entries-category");
		if (!target) return;
		switch (target.nodeName) {
			case "MAKE-ENTRY": {
				target.classList.toggle("click-entry");
				break;
			}
			case "ENTRIES-CATEGORY": {
				let next = target.nextElementSibling;
				while (next) {
					if (this.coloredHover.includes(next)) next.style.backgroundColor = "";
					if (next.nodeName === "MAKE-ENTRY") {
						next.classList.remove("click-entry");
						next.classList.toggle("hide-entry");
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
