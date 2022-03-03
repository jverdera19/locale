window.onload = function () {
    var anchors = document.getElementsByTagName('*');
    for (var i = 0; i < anchors.length; i++) {
        var anchor = anchors[i];
        anchor.onclick = function () {
            code = this.getAttribute('whenClicked');
            eval(code);
        }
    }
}

function checkAvailability(deliveryDate) {
    let deliveryDay = "Friday";
    console.log("Print deliveryDate after using custom function: ",deliveryDate)
    console.log('Checking availability...');

    const numberOfItems = FC.json.item_count;
    // Testing
    console.log('Number of items', numberOfItems);
    canShipOnDeliveryDay();

    function canShipOnDeliveryDay() {
        const cartItems = FC.json.items;
        // Testing
        console.log(cartItems);

        // Clear not avail items array
        itemsNotAvailableTue = [];
        // Let to append items not available
        document.getElementById("unavailableItems").innerHTML = "";
        let unavailableItemsList = document.getElementById("unavailableItems");

        for (var i = 0; i < FC.json.items.length; i++) {

            var current = cartItems[i];
            const currentID = cartItems[i].id;
            // Testing
            //console.log("current: ", current);
            console.log("current options tuesday ", current.options[2].value);

            if (deliveryDay === "Tuesday" && current.options[2].value === 'false') {

                itemsNotAvailableTue.push(current.name);
                console.log("items not avail:", itemsNotAvailableTue);

                let li = document.createElement("li");
                li.innerText = current.name;
                unavailableItemsList.appendChild(li);
            } else if (deliveryDay === "Friday" && current.options[3].value === 'false') {

                itemsNotAvailableTue.push(current.name);
                console.log("items not avail:", itemsNotAvailableTue);

                let li = document.createElement("li");
                li.innerText = current.name;
                unavailableItemsList.appendChild(li);
            }
        }

        if (itemsNotAvailableTue.length !== 0) {
            displayDatePopUp();
        }
    }
}

function removeItemsNotAvailable() {
    const cartItems = FC.json.items;
    
    // Check delivery day - Need to map it to the buttons
    let deliveryDay = ""
    
    if (document.getElementById("deliveryDate").text.includes("Friday")) {
        deliveryDay = "Friday";
    } else {
        deliveryDay = "Tuesday";
    }

    // Testing
    console.log(cartItems);
    console.log("delivery day: ", deliveryDay);

    for (var i = 0; i < FC.json.items.length; i++) {

        var current = cartItems[i];
        const currentID = cartItems[i].id;
        // Testing
        //console.log("current: ", current);
        console.log("current options tuesday ", current.options[2].value);

        if (deliveryDay === "Tuesday" && current.options[2].value === 'false') {
            // Testing
            console.log("REMOVING ITEM!");
            FC.client.request('https://' + FC.settings.storedomain + '/cart?&cart=update&quantity=0&id=' + currentID).done(function (dataJSON) {
                // Testing
                console.log("Item removed");
                // MARK: Rendering doesn't work well when there are multiple items
                //FC.cart.render();
                FC.cart.updateItemQuantity();
                console.log("Cart Updated");
            });
        } else if (deliveryDay === "Friday" && current.options[3].value === 'false') {
            // Testing
            console.log("REMOVING ITEM!");
            FC.client.request('https://' + FC.settings.storedomain + '/cart?&cart=update&quantity=0&id=' + currentID).done(function (dataJSON) {
                // Testing
                console.log("Item removed");
                // MARK: Rendering doesn't work well when there are multiple items
                //FC.cart.render();
                FC.cart.updateItemQuantity();
                console.log("Cart Updated");
            });
        }

    }

    displayDatePopUp();
}

function displayDatePopUp() {
    var x = document.getElementById("datePopUp");
    if (x.style.display === "none") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
}

function dismissDeliveryDateChange() {
    /*
    // Check delivery day
    let newDeliveryDate = document.getElementById("date-select").value;

    // Revert delivery date to previous setting
    if (newDeliveryDate !== "firstDeliveryDate") {
        document.querySelector("#deliveryDate").innerText = document.querySelector("#firstDeliveryDateText").innerText;
        document.getElementById("date-select").value = document.querySelector("#firstDeliveryDateText").innerText;
    } else {
        document.querySelector("#deliveryDate").innerText = document.querySelector("#secondDeliveryDateText").innerText;
        document.getElementById("date-select").value = document.querySelector("#secondDeliveryDateText").innerText;
    }

    // Set button background
    deliveryDateButton = document.getElementsByClassName("delivery-date-button");
    for (i = 0; i < deliveryDateButton.length; i++) {
        deliveryDateButton[i].classList.toggle("active");
    }

    // Set button text
    deliveryDateText = document.getElementsByClassName("delivery-date-text-picked");
    for (i = 0; i < deliveryDateText.length; i++) {
        deliveryDateText[i].classList.toggle("active");
    }
    */

    // Dismiss modal
    displayDatePopUp();
}