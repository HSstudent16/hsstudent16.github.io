const Framework = ( (root, udf) => {
  if (!root || !("document" in root)) {
    throw `Environment not supported!`;
  }

  let doc = root.document;
  let nav,
      footer,
      loading_data;

  function parseXOMrecursively (data, dest, arr) {
    if (data instanceof Array)
    for (let i = 0; i < data.length; i++) {
      let datum = data[i];
      let el, anchor;
      switch (datum.type) {
        case "link":
          el     = doc.createElement('x-link');
          anchor = doc.createElement('a');

          anchor.innerText = datum.name;
          anchor.href = datum.href;

          if (arr) {
            el.setAttribute("arrow", "true");
          }
          el.appendChild(anchor);
          dest.appendChild(el);
        break;
        case "dropdown":
          el     = doc.createElement('x-dropdown');
          let h  = doc.createElement('x-link');
          anchor = doc.createElement('a');
          let d  = doc.createElement('x-dd-content');

          anchor.innerText = datum.name;
          anchor.href = datum.href;

          h.appendChild(anchor);
          el.appendChild(h);

          parseXOMrecursively(datum.content, d, true);

          el.appendChild(d);
          dest.appendChild(el);
      }
      if (datum.disabled) {
        el.setAttribute("disabled", "true");
      }
    }
  }
  root.addEventListener('load', e => {
    nav    = doc.getElementsByTagName("x-nav")[0];
    footer = doc.getElementsByTagName("x-footer")[0];

    if (!nav || !footer) {
      return alert ('Framework failed to load [0x01]');
    }

    if (typeof loading_data !== "object") {
      return alert ('Framework failed to load [0x02]');
    }

    parseXOMrecursively(loading_data["nav-links"], nav);

    let divider = document.createElement("x-column"),
        h2      = document.createElement("h2"),
        par     = document.createElement("p");

    h2.innerText = "The ACME Project";
    par.innerHTML = "All of the code behind ACME and its documentation is licensed witht the MIT license.  More information can be found at the legal page.";

    divider.appendChild(h2);
    divider.appendChild(par);

    footer.appendChild(divider);

    divider = document.createElement("x-column");

    parseXOMrecursively(loading_data["foot-links"], divider, true);

    footer.appendChild(divider);
  });

  return root.Framework = {
    load: data => loading_data = data
  };
} ) ( this );