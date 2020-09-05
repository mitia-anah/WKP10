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
        <td class="picture"><img src="${person.picture}" alt="${person.firstName + ' ' + person.lastName}"/></td>
        <td class="last-name">${person.lastName}</td>
        <td class="first-name">${person.firstName}</td>
        <td class="job-title">${person.jobTitle}</td>
        <td class="job-area">${person.jobArea}</td>
        <td class="phone">${person.phone}</td>
        <td>
            <button class="edit">
                <svg viewBox="0 0 20 20" fill="currentColor" class="pencil w-6 h-6"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
            </button>
            <button class="delete">
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

const editPartner = (person) => {
    person.preventDefault();
    if (person.target.closest('button.edit')) {
        const editButton = person.target.closest('button.edit');
        editPartnerPopup(editButton);
    }
};

const editPartnerPopup = (person) => {
    const picture = document.querySelector('.picture').textContent;
    const lastName = document.querySelector('.last-name').textContent;
    const firstName = document.querySelector('.first-name').textContent;
    const jobTitle = document.querySelector('.job-title').textContent;
    const jobArea = document.querySelector('.job-area').textContent;
    const phone = document.querySelector('.phone').textContent;

    const popup = document.createElement('form');
    popup.classList.add('popup');
    popup.insertAdjacentHTML('afterbegin',
        `
			<div class="popup">
				<img src="${picture}">
				<label for="last-name">Last name</label>
				<input type="text" placeholder="${lastName}">
				<label for="first-name">First name</label>
				<input type="text" placeholder="${firstName}">
				<label for="Job-title">Job title</label>
				<input type="text" placeholder="${jobTitle}">
				<label for="job-area">Job area</label>
				<input type="text" placeholder="${jobArea}">
				<label for="number">Phone number</label>
				<input type="text" placeholder="${phone}">
			</div>    		
			<div class="buttons">
				<button type="button" class="closebtn">X</button>
				<button type="cancel" class="btn cancel">Cancel</button>
				<button type="submit" class="btn save">save</button>
			</div>
    	`
    );

    // listen for a click on that cancel button 
    if (person.cancel) {
        const skipButton = document.querySelector('.cancel');
        popup.firstElementChild.appendChild(skipButton);
        skipButton.addEventListener(
            'click',
            () => {
                resolve(null);
                destroyPopup(popup);
            }, { once: true }
        );
    }
    document.body.appendChild(popup);
    popup.classList.add('open');
}
tbody.addEventListener('click', editPartner);


const deletePartner = (e) => {
    // code delete function here
    if (e.target.closest('button.delete')) {
        const button = e.target.closest('button.delete');
        deleteDeletePopup(button);
    }
};

const deleteDeletePopup = () => {
    // create confirmation popup here
    const deletePopup = document.createElement('delete-popup');

};

tbody.addEventListener('click', deletePartner);

displayList(persons);