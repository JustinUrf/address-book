// Business Logic for AddressBook ---------
function AddressBook() {
  this.contacts = {};
  this.currentId = 0;
}

AddressBook.prototype.addContact = function(contact) {
  contact.id = this.assignId();
  this.contacts[contact.id] = contact;
};

AddressBook.prototype.assignId = function() {
  this.currentId += 1;
  return this.currentId;
};

AddressBook.prototype.findContact = function(id) {
  if (this.contacts[id] !== undefined) {
    return this.contacts[id];
  }
  return false;
};

AddressBook.prototype.deleteContact = function(id) {
  if (this.contacts[id] === undefined) {
    return false;
  }
  delete this.contacts[id];
  return true;
};

// Business Logic for Contacts ---------
function Contact(firstName, lastName, phoneNumber, email, newAddress) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.phoneNumber = phoneNumber;
  this.email = email;
  this.newAddress = newAddress;
}

Contact.prototype.fullName = function() {
  return this.firstName + " " + this.lastName;
};

//User Interface Logic
//variable is global because declared at top level of our file. generally avoid, but here it mimics a database
let addressBook = new AddressBook();

//function that diplays contacts in DOM. Takes address book object as an argument
//we save the div that will contain contacts in a variable called contactsDiv
//next we created claear the innerText of contactsDiv. clears list of contacts before its populated. we do this because our code is set up to loop through all contacts. now user can submit form over and over to create new contacts
//then empty unordered list element. during each loop we'll add new list items to unordered list
//next Object.keys() to get all the keys from addressbooktodisplay.contacts so we can iterate through them. Object.keys() returns an array.
//then array.prototype.foreach() to loop through object keys
//in loop- grab contact object by using addressbook.prototype.findcontact() method, create new list item element for the contact and id attribute equal to contacts id propert, then add newly created list item to unordered list
//after loop finished and list populated, we update the DOM by appending unordered list to the contactsDiv element. 
function listContacts(addressBookToDisplay) {
  let contactsDiv = document.querySelector("div#contacts");
  contactsDiv.innerText =  null;
  const ul = document.createElement("ul");
  Object.keys(addressBookToDisplay.contacts).forEach(function(key) {
    const contact = addressBookToDisplay.findContact(key);
    const li = document.createElement("li");
    li.append(contact.fullName());
    li.setAttribute("id", contact.id);
    ul.append(li);
  });
  contactsDiv.append(ul);
}

//utilizing addressbook.prototype.findcontact() method-we can use here because addressbook is globally scoped
//access spans in DOM to print contacts name and number
//then, show the hidden contact details div with contacts full info
function displayContactDetails(event) {
  const contact = addressBook.findContact(event.target.id);
  document.querySelector(".first-name").innerText = contact.firstName;
  document.querySelector(".last-name").innerText = contact.lastName;
  document.querySelector(".phone-number").innerText = contact.phoneNumber;
  document.querySelector(".email").innerText = contact.email;
  document.querySelector(".address").innerText = contact.newAddress
  document.querySelector("button.delete").setAttribute("id", contact.id);
  document.querySelector("div#contact-details").removeAttribute("class");
}

//define function handle form submission in window load event listener
//we call prevent default to prevent page refresh, gather user uput from form, create new contact object
//add new contact by using address book .prototype .addContact() method
//calls list contact function whenever we add new contact
function handleFormSubmission(event) {
  event.preventDefault();
  const inputtedFirstName = document.querySelector("input#new-first-name").value;
  const inputtedLastName = document.querySelector("input#new-last-name").value;
  const inputtedPhoneNumber = document.querySelector("input#new-phone-number").value;
  const inputtedEmail = document.querySelector("input#new-email").value;
  const inputtedNewAddress = document.querySelector("input#new-address").value;
  let newContact = new Contact(inputtedFirstName, inputtedLastName, inputtedPhoneNumber, inputtedEmail, inputtedNewAddress);
  addressBook.addContact(newContact);
  listContacts(addressBook);
  console.log(newContact)
  document.querySelector("input#new-first-name").value = null;
  document.querySelector("input#new-last-name").value = null;
  document.querySelector("input#new-phone-number").value = null;
  document.querySelector("input#new-email").value = null;
  document.querySelector("input#new-address").value = null;
}

function handleDelete(event) {
  addressBook.deleteContact(event.target.id);
  document.querySelector("button.delete").removeAttribute("id");
  document.querySelector("div#contact-details").setAttribute("class", "hidden");
  listContacts(addressBook);
}

//event listener for load event. called when page has loaded all resources. 
//event listener then for click event on contacts div and anything inside it
window.addEventListener("load", function (){
  document.querySelector("form#new-contact").addEventListener("submit", handleFormSubmission);
  document.querySelector("div#contacts").addEventListener("click", displayContactDetails);   
  document.querySelector("button.delete").addEventListener("click", handleDelete);
});