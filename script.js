import faker from 'faker';

const tbody = document.querySelector('tbody');

let persons = Array.from({ length: 10 }, () => {
    return {
        id: faker.random.uuid(),
        lastName: faker.name.lastName(),
        firstName: faker.name.firstName(),
        jobTitle: faker.name.jobTitle(),
        jobArea: faker.name.jobArea(),
        phone: faker.phone.phoneNumber(),
        picture: faker.image.avatar(100, 100),
    };
});

const displayList = data => {
    tbody.innerHTML = data
        .map(
            (person, index) => `
    <tr class='container' data-id="${person.id}" class="${index % 2 ? 'even' : ''}">
        <td ><img src="${person.picture}" alt="${person.firstName + ' ' + person.lastName}"/></td>
        <td class="lastName">${person.lastName}</td>
        <td >${person.firstName}</td>
        <td >${person.jobTitle}</td>
        <td >${person.jobArea}</td>
        <td >${person.phone}</td>
        <td>
            <button value="${person.id}"class="edit">
                <svg viewBox="0 0 20 20" fill="currentColor" class="pencil w-6 h-6"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
            </button>
            <button value="${person.id}" class="delete">
                <svg viewBox="0 0 20 20" fill="currentColor" class="trash w-6 h-6"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            </button>
            </td>
    </tr>
`
        )
        .join('');
};

function wait(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function destroyPopup(popup) {
    popup.classList.remove("open");
    // Wait for 1 sec, to let the animation do its work.
    await wait(1000);
    // remove it from the DOM
    popup.remove();
    // remove it from the javascript memory
    popup = null;
}


const editPartner = (e) => {
    e.preventDefault();
    if (e.target.closest('button.edit')) {
        // every time we click the icon in each table rows, the popup will appear  
        const editButton = e.target.closest('tr');
        const editedBtn = editButton.value;
        editPartnerPopup(editedBtn);
    }
};

const editPartnerPopup = (personId) => {
    console.log(persons)
        // Find arrays taht has an id from the object
        // const editedPartner = persons.find(person => person.id === personId);
    const editedPartner = persons.find(person => person.id !== personId);
    console.log(editedPartner);
    return new Promise(async function(resolve) {

        // We create form here
        const popup = document.createElement('form');
        popup.classList.add('popup');
        popup.insertAdjacentHTML('afterbegin',
            `
			<div class="popup">
				<input type="url" name="picture" value="${editedPartner.picture}">
				<label for="last-name">Last name</label>
				<input type="text" name="lastName" value="${editedPartner.lastName}">
				<label for="first-name">First name</label>
				<input type="text" name="firstName" value="${editedPartner.firstName}">
				<label for="Job-title">Job title</label>
				<input type="text" name="jobTitle" value="${editedPartner.jobTitle}">
				<label for="job-area">Job area</label>
				<input type="text" name="jobArea" value="${editedPartner.jobArea}">
				<label for="number">Phone number</label>
				<input type="text" name="phone" value="${editedPartner.phone}">
			</div>    		
			<div class="buttons">
				<button type="button" class="closebtn">X</button>
				<button type="cancel" class="btn cancel">Cancel</button>
				<button type="submit" class="btn submit">submit</button>
			</div>
    	`
        );

        window.addEventListener('click', e => {
            if (e.target.closest('button.cancel')) {
                destroyPopup(popup);
            }
        })

        popup.addEventListener(
            'submit',
            e => {
                e.preventDefault();
                const popup = e.target;
                editedPartner.lastName = popup.lastName.value,
                    editedPartner.firstName = popup.firstName.value,
                    editedPartner.jobTitle = popup.jobTitle.value,
                    editedPartner.jobArea = popup.jobArea.value,
                    editedPartner.phone = popup.phone.value,
                    editedPartner.picture = popup.picture.value,

                    displayList(persons);
                resolve(e.currentTarget.remove());
                destroyPopup(popup);

            }, { once: true });
        document.body.appendChild(popup);
        popup.classList.add('open');
    });
}
tbody.addEventListener('click', editPartner);



const deletePartner = (e) => {
    e.preventDefault();
    // code delete function here
    if (e.target.closest('button.delete')) {
        const deletePerson = e.target.closest('tr');
        const deleteB = deletePerson.querySelector('button.delete');
        const deleteBtn = deleteB.value;
        deleteDeletePopup(deleteBtn);
    }
};

const deleteDeletePopup = (elToDelete) => {
    // const deleteButton = persons.filter(person => person.id === elToDelete);
    // console.log(deleteButton);
    return new Promise(async function(resolve) {
        const partnerToDelete = document.createElement('div');
        const lastName = document.querySelector('.lastName').textContent;
        partnerToDelete.classList.add('to-delete');
        partnerToDelete.insertAdjacentHTML('afterbegin',
            `
            <div class="to-deleteEl">
                <p> Are you sure to remove ${lastName}?</p>
                <button class="remove">Yes</button>
                <button type="cancel" class="cancel">No</button>
			</div>
        `);

        window.addEventListener('click', e => {
            if (e.target.closest('button.cancel')) {
                destroyPopup(partnerToDelete);
            }
        });

        partnerToDelete.addEventListener('click', e => {
            if (e.target.closest('button.remove')) {
                const removePartner = persons.filter(person => person.id !== elToDelete);
                persons = removePartner;
                displayList(removePartner);
                destroyPopup(partnerToDelete);
            }
        })
        document.body.appendChild(partnerToDelete);
        partnerToDelete.classList.add('open');
    });
}
window.addEventListener('click', deletePartner);
displayList(persons);