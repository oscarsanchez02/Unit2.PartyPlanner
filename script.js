const baseURL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-ftb-et-web-pt/events";

async function logAsync(func) {
    const result = await func();
    console.log(result);
}

// Get all parties
async function getParties() {
    const response = await fetch(baseURL);
    const json = await response.json();

    if (!json.success) {
        throw new Error(json.error);
    }

    return json.data;
}

// Create a party
async function createParty(party) {
    const response = await fetch(baseURL, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(party),
    });
    const json = await response.json();

    if (!json.success) {
        throw new Error(json.error.message);
    }

    return json.data;
}

// Get a single party by ID
async function getPartyById(id) {
    const response = await fetch(`${baseURL}/${id}`);
    const json = await response.json();

    if (!json.success) {
        throw new Error(json.error.message);
    }

    return json.data;
}

// Update party by ID
async function updateParty(id, party) {
    const response = await fetch(`${baseURL}/${id}`, {
        method: 'put',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(party),
    });
    const json = await response.json();

    if (!json.success) {
        throw new Error(json.error.message);
    }

    return json.data;
}

// Delete party by ID
async function deleteParty(id) {
    const response = await fetch(`${baseURL}/${id}`, {
        method: 'delete'
    });

    if (response.status === 204) {
        return true;
    }

    throw new Error(`Unable to remove party with ID ${id}`);
}

// Render party to screen
function addPartyToScreen(p) {
    const partyElement = document.getElementById('parties');
    const elem = document.createElement('div');
    elem.classList.add('party');

    const nameElem = document.createElement('div');
    nameElem.classList.add('name');
    nameElem.append(p.name);

    const dateElem = document.createElement("div");
    dateElem.classList.add("date");
    dateElem.append(p.date);

    const locationElem = document.createElement("div");
    locationElem.classList.add("location");
    locationElem.append(p.location);

    const descriptionElem = document.createElement('div');
    descriptionElem.classList.add('description');
    descriptionElem.append(p.description);
    
    // this will be the Delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', async () => {
        try {
            await deleteParty(p.id);
            elem.remove(); 
        } catch (error) {
            console.error(error);
            
        }
    });

    elem.append(dateElem);
    elem.append(locationElem);
    elem.append(nameElem);
    elem.append(descriptionElem);
    elem.append(deleteButton);

    partyElement.append(elem);
}

document.addEventListener('DOMContentLoaded', async () => {
    const parties = await getParties();
    parties.forEach(p => {
        addPartyToScreen(p);
    });

    const form = document.getElementById("partyForm");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const date = document.getElementById("date").value;
        const location = document.getElementById("location").value;
        const description = document.getElementById("description").value;

        const party = {
            name: name,
            date: date,
            location: location,
            description: description
        };

        try {
            const newParty = await createParty(party);
            addPartyToScreen(newParty);
        } catch (err) {
            console.error(err);
        }
    });
});
