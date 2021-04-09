let hideEmployeeSavedAlertTimer = undefined;
//adds the click event handler when the page loads
document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("saveButton")
		.addEventListener("click", saveActionClick);

	const employeeFirstNameEditElement =
		getEmployeeFirstNameEditElement();
	employeeFirstNameEditElement.focus();
	employeeFirstNameEditElement.select();
});

// Save
function saveActionClick(event) {
	//Makes sure all the data entered is valid
	if (!validateSave()) {
		return;
	}

	const saveActionElement = event.target;
	saveActionElement.disabled = true;

	const employeeId = getEmployeeId();
	const employeeIdIsDefined = (employeeId.trim() !== "");
	const saveActionUrl = ("/api/employee/"
		+ (employeeIdIsDefined ? employeeId : ""));
	//gets all of the valid employee data 
	const saveEmployeeRequest = {
		id: employeeId,
		managerId: getEmployeeManagerId(),
		lastName: getEmployeeLastNameEditElement().value,
		password: getEmployeePasswordEditElement().value,
		firstName: getEmployeeFirstNameEditElement().value,
		classification: getEmployeeTypeSelectElement().value
	};

	if (employeeIdIsDefined) {
		//performs this patch if the employee exists
		ajaxPatch(saveActionUrl, saveEmployeeRequest, (callbackResponse) => {
			saveActionElement.disabled = false;

			if (isSuccessResponse(callbackResponse)) {
				completeSaveAction(callbackResponse);
			}
		});
	} else {
		//performs this ajaxpost if the employee is new
		ajaxPost(saveActionUrl, saveEmployeeRequest, (callbackResponse) => {
			saveActionElement.disabled = false;
			if (isSuccessResponse(callbackResponse)) {
				completeSaveAction(callbackResponse);
			}
		});
	}
}

function validateSave() {
	const firstNameEditElement = getEmployeeFirstNameEditElement();
	//Checks if first name is blank
	if (firstNameEditElement.value.trim() === "") {
		displayError("Please provide a valid employee first name.");
		firstNameEditElement.focus();
		firstNameEditElement.select();
		return false;
	}

	const lastNameEditElement = getEmployeeLastNameEditElement();
	//Checks if last name is blank
	if (lastNameEditElement.value.trim() === "") {
		displayError("Please provide a valid employee last name.");
		lastNameEditElement.focus();
		lastNameEditElement.select();
		return false;
	}

	const passwordEditElement = getEmployeePasswordEditElement();
	//Checks if password is blank
	if (passwordEditElement.value.trim() === "") {
		displayError("Please provide a valid employee password.");
		passwordEditElement.focus();
		passwordEditElement.select();
		return false;
	}
	//Checks if password and confirm password are the same
	if (passwordEditElement.value !== getEmployeeConfirmPassword()) {
		displayError("Passwords do not match.");
		passwordEditElement.focus()
		passwordEditElement.select();
		return false;
	}
	//Checks if employee type is valid
	const employeeTypeSelectElement = getEmployeeTypeSelectElement();
	if (!employeeTypeSelectElement.closest("tr").classList.contains("hidden")) {
		if (employeeTypeSelectElement.value <= 0) {
			displayError("Please provide a valid employee Type.");
			employeeTypeSelectElement.focus();
			return false;
		}
	}

	return true;
}

function completeSaveAction(callbackResponse) {
	if (callbackResponse.data == null) {
		return;
	}

	if ((callbackResponse.data.redirectUrl != null)
		&& (callbackResponse.data.redirectUrl !== "")) {

		window.location.replace(callbackResponse.data.redirectUrl);
		return;
	}
	
	//displays the employee save alert
	displayEmployeeSavedAlertModal();

	const employeeEmployeeIdElement = getEmployeeEmployeeIdElement();
	const employeeEmployeeIdRowElement = employeeEmployeeIdElement.closest("tr");
	//if employee ID element is not visible then display it
	if (employeeEmployeeIdRowElement.classList.contains("hidden")) {
		setEmployeeId(callbackResponse.data.id);
		employeeEmployeeIdElement.value = callbackResponse.data.employeeId;
		employeeEmployeeIdRowElement.classList.remove("hidden");
	}
}

function displayEmployeeSavedAlertModal() {
	//checks if employee alert is hidden
	if (hideEmployeeSavedAlertTimer) {
		clearTimeout(hideEmployeeSavedAlertTimer);
	}

	const savedAlertModalElement = getSavedAlertModalElement();
	savedAlertModalElement.style.display = "none";
	savedAlertModalElement.style.display = "block";

	hideEmployeeSavedAlertTimer = setTimeout(hideEmployeeSavedAlertModal, 1200);
}

function hideEmployeeSavedAlertModal() {
	if (hideEmployeeSavedAlertTimer) {
		clearTimeout(hideEmployeeSavedAlertTimer);
	}

	getSavedAlertModalElement().style.display = "none";
}
// End save

//Getters and setters
function getEmployeeId() {
	return document.getElementById("employeeId").value;
}
function setEmployeeId(employeeId) {
	document.getElementById("employeeId").value = employeeId;
}

function getEmployeeManagerId() {
	return document.getElementById("employeeManagerId").value;
}

function getEmployeeEmployeeId() {
	return getEmployeeEmployeeIdElement().value;
}
function getEmployeeEmployeeIdElement() {
	return document.getElementById("employeeEmployeeId");
}

function getSavedAlertModalElement() {
	return document.getElementById("employeeSavedAlertModal");
}

function getEmployeeFirstNameEditElement() {
	return document.getElementById("employeeFirstName");
}

function getEmployeeLastNameEditElement() {
	return document.getElementById("employeeLastName");
}

function getEmployeePasswordEditElement() {
	return document.getElementById("employeePassword");
}

function getEmployeeConfirmPassword() {
	return document.getElementById("employeeConfirmPassword").value;
}

function getEmployeeTypeSelectElement() {
	return document.getElementById("employeeType");
}
//End getters and setters
