const categories = ["generic", "minecraft", "brand", "badge"];
let currentModalIcon = "";

// Render icons
function renderIcons(filter="") {
    const container = document.getElementById("iconsGrid");
    container.innerHTML = "";
    categories.forEach(category=>{
        const filtered = icons.filter(icon =>
            icon.type === category &&
            (icon.name.toLowerCase().includes(filter.toLowerCase()) || icon.type.includes(filter.toLowerCase()))
        );
        if (!filtered.length){
            return;
        } 

        const header = document.createElement("h2");
        header.textContent = category.charAt(0).toUpperCase() + category.slice(1) + " Icons";
        header.className = `category-header category-${category}`;
        container.appendChild(header);

        const grid = document.createElement("div");
        grid.className = "grid-container";
        filtered.forEach((icon,i)=>{
            const card = document.createElement("div");
            card.className="card";
            card.innerHTML = `
                <img src="${icon.src}" alt="${icon.name}" loading="lazy" onclick="openBadgeModal('${icon.src}')">
                <div class="url" data-url="${icon.src}" id="${category}${i}">${icon.name}</div>
                <div class="button-row">
                    <div class="dropdown">
                        <button>Copy ▼</button>
                        <div class="dropdown-content">
                            <button onclick="copyUrl('${category}${i}','url')">URL</button>
                            <button onclick="copyUrl('${category}${i}','html')">HTML</button>
                            <button onclick="copyUrl('${category}${i}','markdown')">Markdown</button>
                        </div>
                    </div>
                    <button onclick="openBadgeModal('${icon.src}')">Generate Badge</button>
                </div>
            `;
            grid.appendChild(card);
        });
        container.appendChild(grid);
    });
}

// Copy URL / HTML / Markdown
function copyUrl(id,type){
    const urlDiv = document.getElementById(id);
    const url = urlDiv.getAttribute("data-url").trim();
    let text;
    if(type==="url"){
        text=window.location.origin+url;
    } else if(type==="html"){
        text=`<img src="${window.location.origin}${url}" target="_blank" alt="${urlDiv.previousElementSibling.alt || ''}">`;
    } else if(type==="markdown") {
        text=`![${window.location.origin}${urlDiv.previousElementSibling.alt || ''}](${url})`;
    }
    navigator.clipboard.writeText(text).then(()=>showToast("Copied!")).catch(()=>showToast("Copy failed!", true));
}

// Badge modal
function openBadgeModal(src){
    currentModalIcon=src;
    document.getElementById("modalIconPreview").src=src;
    document.getElementById("modalUrlInput").value="";
    document.getElementById("modalPreview").innerHTML="";
    document.getElementById("badgeModal").style.display="flex";
}
function closeModal(){
    document.getElementById("badgeModal").style.display="none";
}
document.getElementById("modalUrlInput").addEventListener("input", e=>{
    const url=e.target.value.trim();
    document.getElementById("modalPreview").innerHTML=`<a href="${url}"><img src="${currentModalIcon}"></a>`;
});

function copyBadge(type){
    const url = document.getElementById("modalUrlInput").value.trim();
    if(!isValidURL(url)){
        return showToast("Invalid URL!", true);
    } 

    let text="";
    if(type==="html") {
        text=`<a href="${url}" target="_blank"><img src="${window.location.origin}${currentModalIcon}"></a>`;
    }else if(type==="markdown") {
        text=`[![Badge](${window.location.origin}${currentModalIcon})](${url})`;
    }

    navigator.clipboard.writeText(text)
        .then(()=>showToast("Copied!"))
        .catch(()=>showToast("Copy failed!", true));
}

// Basic URL validation
function isValidURL(str) {
    const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
    return pattern.test(str);
}

// Show toast
function showToast(msg, isError=false){
    Toastify({
        text: msg,
        duration: 2500,
        gravity: "top",
        position: "right",
        backgroundColor: isError ? "#ff5555" : "#00c8ff",
        stopOnFocus: true
    }).showToast();
}

// Search
document.getElementById("searchBar").addEventListener("input",e=>renderIcons(e.target.value));
renderIcons();

// Back to top
const backToTop = document.getElementById("backToTop");
window.onscroll = ()=>{backToTop.style.display = (document.documentElement.scrollTop>300)?"block":"none";};
function scrollToTop(){window.scrollTo({top:0,behavior:"smooth"});}