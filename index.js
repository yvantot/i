import { Utils } from "./utils.js";

class AppLinks extends HTMLElement {
	constructor() {
		super();
		this.favicon_api = "https://www.google.com/s2/favicons?sz=64&domain=";
	}

	connectedCallback() {
		let links = this.getAttribute("app-links");
		if (!links) {
			this.classList.add("no-display");
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

class Product extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		// Passing native null value as an attribute to <app-links> as its attribute will make the null value to "null"
		// so instead use ?? "" to make it a falsy value
		const links = this.getAttribute("app-links") ?? "";

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
					<app-links app-links="${links}"></app-links>
				</div>                
                <img loading="lazy" class="screenshot" src="${screenshot}"/>
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

		const target = event.target.closest("product-app");
		if (!target) return;
		if (target.classList.contains("click-entry")) return;
		if (target.style.backGroundColor) return;

		const color = target.getAttribute("app-color") ?? "teal";
		target.style.backgroundColor = color;
		this.coloredHover.push(target);
	}

	handleClick(event) {
		const target = event.target.closest("product-app, h2");
		if (!target) return;
		switch (target.nodeName) {
			case "PRODUCT-APP": {
				target.classList.toggle("click-entry");
				break;
			}
			case "H2": {
				let next = target.nextElementSibling;
				console.log(next);
				while (next) {
					if (this.coloredHover.includes(next)) next.style.backgroundColor = "";
					if (next.nodeName === "PRODUCT-APP") {
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

customElements.define("app-links", AppLinks);
customElements.define("product-app", Product);

const index = new Index();
index.init();
