export class Utils {
	static limit_line_length(str, max = 40, indication = "...") {
		if (str == null || str === "") return;
		if (str.length <= max) return str;
		return str.slice(0, max - indication.length) + indication;
	}

	static create_element(name, attr = {}, inner = []) {
		const { shadow = false, namespace = null } = attr;

		let host = null;

		let element;
		if (namespace === "svg") element = document.createElementNS("http://www.w3.org/2000/svg", name);
		else element = document.createElement(name);

		if (!namespace && element instanceof HTMLUnknownElement) throw new Error(`${element} is not a valid HTML tag`);

		if (shadow) host = element.attachShadow({ mode: "open" });

		if (inner.length && typeof inner === "object") {
			for (let node of inner) {
				if (typeof node === "string") {
					if (shadow) host.textContent += node.trim();
					else element.textContent += node.trim();
				} else if (node instanceof HTMLElement) {
					if (shadow) host.append(node);
					else element.append(node);
				}
			}
		}

		delete attr.shadow;
		delete attr.namespace;

		for (let key in attr) {
			if (key === "dataset") {
				if (Object.keys(attr.dataset) === 0) throw new Error("dataset must not be empty");
				if (typeof attr.dataset !== "object") throw new Error("dataset must be an object");
				for (let dataset_key in attr.dataset) element.dataset[dataset_key] = attr.dataset[dataset_key];
				continue;
			}
			if (key in element) element[key] = attr[key];
			else element.setAttribute(key, attr[key]);
		}

		if (shadow) return { host, element };
		else return element;
	}
}
