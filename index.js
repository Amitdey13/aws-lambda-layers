"use strict"
// sbg icons
const searchIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>`;
// const loaderIcon = `<svg class="rotate-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader"><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/><line x1="4.93" x2="7.76" y1="4.93" y2="7.76"/><line x1="16.24" x2="19.07" y1="16.24" y2="19.07"/><line x1="2" x2="6" y1="12" y2="12"/><line x1="18" x2="22" y1="12" y2="12"/><line x1="4.93" x2="7.76" y1="19.07" y2="16.24"/><line x1="16.24" x2="19.07" y1="7.76" y2="4.93"/></svg>`;
const doubleTickIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00ff62" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-check"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg>`;
const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const downArrowIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>`;
const loaderIcon = `<svg class="rotate-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`;
const tickIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>`;

let pythonVersions = [];
let regions = [];
let libraries = [];

let params = {
    version: null,
    region: null,
    library: null
};

document.onload = onLoad();

function onLoad() {
    params = {
        version: null,
        region: null,
        library: null,
    };
    getPythonVersions();
    getRegions();

    document.addEventListener('click', function (event) {
        const targetElement = event.target;
        const versionList = document.getElementById(`version-list`);
        const regionList = document.getElementById(`region-list`);
        const libList = document.getElementById(`library-list`);
        const versionBtn = document.getElementById(`version-btn`);
        const regionBtn = document.getElementById(`region-btn`);
        const libBtn = document.getElementById(`library-btn`);
        if (!versionList.contains(targetElement) && targetElement !== versionBtn && !versionBtn.contains(targetElement)) {
            versionList.classList.add('hidden');
        }
        if (!regionList.contains(targetElement) && targetElement !== regionBtn && !regionBtn.contains(targetElement)) {
            regionList.classList.add('hidden');
        }
        if (!libList.contains(targetElement) && targetElement !== libBtn && !libBtn.contains(targetElement)) {
            libList.classList.add('hidden');
        }
    });
}

async function getPythonVersions() {
    const versionSate = document.getElementById("version-state");
    versionSate.innerHTML = loaderIcon;
    const apiUrl = "data/versions.json";
    try {
        const res = await fetch(apiUrl);
        if (res.ok) {
            const versions = await res.json();
            pythonVersions = [...versions];
        }
        createVersionList();
    } catch (error) {
        console.error("There was a problem in fetching versions:", error);
    }
}

async function getRegions() {
    const regionSate = document.getElementById("region-state");
    regionSate.innerHTML = loaderIcon;
    const apiUrl = "data/regions.json";
    try {
        const res = await fetch(apiUrl);
        if (res.ok) {
            const reg = await res.json();
            regions = [...reg];
        }
        createRegionList();
    } catch (error) {
        console.error("There was a problem in fetching versions:", error);
    }
}

async function getLibraries() {
    if (!(params.region && params.version)) {
        return;
    }
    resetArn();
    const list = document.getElementById(`library-list`);
    const liElements = list.querySelectorAll('li');
    liElements.forEach(li => {
        list.removeChild(li);
    });
    const librarySate = document.getElementById("library-state");
    librarySate.innerHTML = loaderIcon; //p3.12 ap-southeast-1
    const apiUrl = `https://api.klayers.cloud/api/v2/${params.version.value}/layers/latest/${params.region.value}`;
    try {
        const res = await fetch(apiUrl);
        if (res.ok) {
            const lib = await res.json();
            libraries = lib.map((eachLib, index) => ({
                id: index,
                label: eachLib.package,
                value: eachLib.package,
                arn: eachLib.arn,
            }));
            libraries.sort((a, b) => {
                const nameA = a.label.toUpperCase();
                const nameB = b.label.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
        }
        createLibraryList();
    } catch (error) {
        console.error("There was a problem in fetching libraries:", error);
    }
}

function createVersionList() {
    const versionList = document.getElementById("version-list");
    pythonVersions.forEach((eachVersion) => {
        versionList.appendChild(createListItem(eachVersion, "version"));
    });
    const versionSate = document.getElementById("version-state");
    versionSate.innerHTML = downArrowIcon;
    versionSate.parentNode.removeAttribute("disabled");
    versionSate.parentNode.classList.remove("cursor-not-allowed");
}

function createRegionList() {
    const regionList = document.getElementById("region-list");
    regions.forEach((eachVersion) => {
        regionList.appendChild(createListItem(eachVersion, "region"));
    });
    const regionSate = document.getElementById("region-state");
    regionSate.innerHTML = downArrowIcon;
    regionSate.parentNode.removeAttribute("disabled");
    regionSate.parentNode.classList.remove("cursor-not-allowed");
}

function createLibraryList() {
    const libraryList = document.getElementById("library-list");
    libraries.forEach((eachLib) => {
        libraryList.appendChild(createListItem(eachLib, "library"));
    });
    const librarySate = document.getElementById("library-state");
    librarySate.innerHTML = downArrowIcon;
    librarySate.parentNode.removeAttribute("disabled");
    librarySate.parentNode.classList.remove("cursor-not-allowed");
}

function createListItem(data, type) {
    const li = document.createElement("li");
    const itemId = `${type}-option-${data.id}`;
    li.classList.add(
        "text-white-900",
        "relative",
        "cursor-default",
        "select-none",
        "py-2",
        "pl-3",
        "pr-9",
        "hover:bg-gray-600",
        "focus:bg-gray-600"
    );
    li.id = itemId;
    li.setAttribute("role", "option");
    li.setAttribute("data-value", data.value);
    li.setAttribute("data-id", itemId);
    li.onclick = onClickListItem;

    const titleSpan = document.createElement("span");
    titleSpan.classList.add("font-normal", "ml-3", "block", "truncate");
    titleSpan.textContent = data.label;
    titleSpan.setAttribute("data-id", itemId);
    titleSpan.onclick = onClickListItem;

    const statusSpan = document.createElement("span");
    statusSpan.classList.add(
        "text-white-600",
        "absolute",
        "inset-y-0",
        "right-0",
        "flex",
        "items-center",
        "pr-4",
        "hidden"
    );
    statusSpan.id = "status-icon";
    statusSpan.innerHTML = tickIcon;

    li.appendChild(titleSpan);
    li.appendChild(statusSpan);
    return li;
}

function onClickListItem(event) {
    event.stopPropagation();
    const [type, _, id] = event.target.getAttribute("data-id").split("-");
    const selectedElement = document.getElementById(`selected-${type}`);
    switch (type) {
        case "version":
            if (params.version?.id != id) {
                const version = pythonVersions.find(
                    (eachVersion) => eachVersion.id === parseInt(id)
                );
                params.version = version;
                selectedElement.textContent = version.label;
                getLibraries();
            }
            break;

        case "region":
            if (params.region?.id != id) {
                const region = regions.find(
                    (eachVersion) => eachVersion.id === parseInt(id)
                );
                params.region = region;
                selectedElement.textContent = region.label;
                getLibraries();
            }
            break;

        case "library":
            if (params.library?.id != id) {
                const arnText = document.getElementById("arnText");
                const lib = libraries.find(eachLib => eachLib.id === parseInt(id));
                params.library = lib;
                selectedElement.textContent = lib.label;
                arnText.textContent = lib.arn;
            }
            break;

        default:
            break;
    }
    const list = document.getElementById(`${type}-list`);
    list.classList.add("hidden");
    list.childNodes.forEach((eachNode) => {
        const [_, __, nodeId] = eachNode.id.split("-");
        if (nodeId == id) {
            eachNode.lastChild.classList.remove("hidden");
        } else {
            eachNode.lastChild.classList.add("hidden");
        }
    });
}

function addRegionList() { }

function copyArn() {
    const arnText = document.getElementById("arnText").innerText;
    const copyBtn = document.getElementById("copyBtn");

    navigator.clipboard.writeText(arnText).then(function () {
        copyBtn.innerHTML = doubleTickIcon;
        setTimeout(() => {
            copyBtn.innerHTML = copyIcon;
        }, 3000);
    });
}

function getArn() {
    const getArnBtn = document.getElementById("getArn");
    getArnBtn.innerHTML = loaderIcon;
    setTimeout(() => {
        getArnBtn.innerHTML = searchIcon;
    }, 3000);
}

function toggleDropdownList(e) {
    const listId = getListId(e.target);
    const listElement = document.getElementById(listId);
    if (listElement.classList.contains("hidden")) {
        listElement.classList.remove("hidden");
        return;
    }
    listElement.classList.add("hidden");
    e.stopPropagation();
}

function getListId(element) {
    let listId = element.getAttribute("data-dropdown");
    if (!listId && element.tagName !== "BUTTON") {
        listId = getListId(element.parentNode);
    }
    return listId;
}

function resetArn() {
    const arnText = document.getElementById("arnText");
    const selectedElement = document.getElementById(`selected-library`);
    selectedElement.textContent = "Select Library";
    arnText.textContent = "Select version, region and library to get ARN";
}