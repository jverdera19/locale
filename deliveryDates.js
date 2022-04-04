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

var FC = FC || {};

// Define variables for handling delivery date selection
let deliveryDateFC = "";
let deliveryDate2FC = "";

// Dynamic Price Calculation v3.1
var pricemod_regex = /[{\|]p([+\-:])([\d\.]+)(?:\D{3})?(?=[\|}])/, id_regex = /^(\d+):/, FC = FC || {};
FC.onLoad = function () {
    FC.client.on("ready.done", initFC);
    console.log("Compeleted loading FC");
};

function initFC() {
    console.log("Starting initFC");
    initDeliveryDateButtons();
    initDynamicPrice();
}



// Adding/reading delivery dates from Foxy Cart
function initDeliveryDateButtons() {
    console.log("FC client ready.done");
    if (typeof FC.json.custom_fields.deliveryDate === "undefined") {
        FC.client.request('https://' + FC.settings.storedomain + '/cart?h:deliveryDate=' + deliveryDate + '&h:deliveryDate2=' + deliveryDate2).done(function (dataJSON) {
            console.log("added deliveryDateFC", FC.json.custom_fields.deliveryDate);
            console.log("added deliveryDate2FC", FC.json.custom_fields.deliveryDate2);
            deliveryDateFC = FC.json.custom_fields.deliveryDate.value;
            deliveryDate2FC = FC.json.custom_fields.deliveryDate2.value;
            //initButtons();
        });

    } else {
        deliveryDateFC = FC.json.custom_fields.deliveryDate.value;
        deliveryDate2FC = FC.json.custom_fields.deliveryDate2.value;
        console.log("deliveryDateFC was valid already", deliveryDateFC);
        console.log("deliveryDate2FC was valid already", deliveryDate2FC);

        checkDeliveryDates();
    }
};

function initDynamicPrice() {
    console.log("Starting initDynamicPrice");
    ADJUST = {}; $("input,select").off("change.foxy-dynamic-price");
    $('form[action*="' + FC.settings.storedomain + '"]').each(function () {
        var b = $(this), d = "", g = { products: {} };
        $(this).find("[name='name'],[name^='name||'],[name$=':name'],[name*=':name||']").each(function () {
            var k = getId(this.name), c = k ? k + ":" : "", e = parseFloat(b.find("[name='" + c + "price'],[name^='" + c + "price||']").first().val());
            e = { id: k, code: "", base_price: isNaN(e) ? 0 : e, quantity: 1, attributes: {}, has_quantity: !1 }; var h = b.find("[name='" +
                c + "quantity'],[name^='" + c + "quantity||']"); c = b.find("[name='" + c + "code'],[name^='" + c + "code||']"); 0 < c.length && (e.code = clearHash(c.first().val()), "" === d && (d = e.code)); if (0 < h.length) { c = 0; var l = getElementType(h); -1 < ["select", "text"].indexOf(l) ? (e.has_quantity = !0, c = parseFloat(clearHash(h.val()))) : -1 < ["radio", "checkbox"].indexOf(l) && (e.has_quantity = !0, 1 == h.filter(":checked").length && (c = parseFloat(clearHash(h.filter(":checked").val())))); isNaN(c) && (c = 0); e.quantity = c } g.products[k] = e
        }); b.attr("data-fc-form-code") &&
            (d = b.attr("data-fc-form-code")); "" !== d && ($(this).find("input,select").each(function () {
                var b = getId(this.name), c = getName(this.name), e = getElementType($(this)); if ("quantity" == c) $(this).data("fc-adjust-for", d).on("change.foxy-dynamic-price", function () { var c = 0; if (-1 < ["select", "text"].indexOf(e) || -1 < ["radio", "checkbox"].indexOf(e) && $(this).is(":checked")) c = parseFloat(clearHash(this.value)); isNaN(c) && (c = 0); ADJUST[$(this).data("fc-adjust-for")].products[b].quantity = c; recalcTotal() }); else if ("price" == c && "hidden" !=
                    e) $(this).data("fc-adjust-for", d).on("change.foxy-dynamic-price", function () { var c = 0; if (-1 < ["select", "text"].indexOf(e) || -1 < ["radio", "checkbox"].indexOf(e) && $(this).is(":checked")) c = parseFloat(clearHash(this.value)); isNaN(c) && (c = 0); ADJUST[$(this).data("fc-adjust-for")].products[b].base_price = c; recalcTotal() }); else if ("SELECT" == this.tagName) {
                        var h = !1; $(this).children("option").each(function () { -1 < this.value.search(pricemod_regex) && (h = !0) }); h && ($(this).data("fc-adjust-for", d), g.products[b].attributes[clearHash(this.name)] =
                            clearHash(this.value), $(this).on("change.foxy-dynamic-price", function () { ADJUST[$(this).data("fc-adjust-for")].products[b].attributes[clearHash(this.name)] = clearHash(this.value); recalcTotal() }))
                    } else if (-1 < this.value.search(pricemod_regex)) switch ($(this).data("fc-adjust-for", d), $(this).attr("type")) {
                        case "checkbox": $(this).is(":checked") ? g.products[b].attributes[clearHash(this.name)] = clearHash(this.value) : g.products[b].attributes[clearHash(this.name)] = ""; $(this).on("change.foxy-dynamic-price", function () {
                            $(this).is(":checked") ?
                                ADJUST[$(this).data("fc-adjust-for")].products[b].attributes[clearHash(this.name)] = clearHash(this.value) : ADJUST[$(this).data("fc-adjust-for")].products[b].attributes[clearHash(this.name)] = ""; recalcTotal()
                        }); break; case "radio": g.products[b].attributes.hasOwnProperty(clearHash(this.name)) || (g.products[b].attributes[clearHash(this.name)] = ""), $(this).is(":checked") && (g.products[b].attributes[clearHash(this.name)] = clearHash(this.value)), $("[name='" + this.name + "']").data("fc-adjust-for", d).on("change.foxy-dynamic-price",
                            function () { ADJUST[$(this).data("fc-adjust-for")].products[b].attributes[clearHash(this.name)] = clearHash(this.value); recalcTotal() })
                    }
            }), ADJUST[d] = g)
    });
    recalcTotal()
}
function clearHash(b) {
    return b.replace(/\|\|[\d\w]+(?:\|\|open)?$/, "")
}
function getNameParts(b) {
    b = clearHash(b); return b.match(/(?:(\d+):)?(.*)/)
}

function getId(b) {
    b = getNameParts(b); id_regex.test(this.name) && (prefix = parseInt(this.name.match(id_regex)[0])); return void 0 === b[1] ? 0 : parseInt(b[1])
}

function getName(b) {
    return getNameParts(b)[2]
}

function getElementType(b) {
    if ("SELECT" == b[0].tagName) return "select";
    if ("INPUT" == b[0].tagName) switch (b.attr("type").toLowerCase()) {
        case "text": case "number": case "tel": return "text"; default: return b.attr("type").toLowerCase()
    }
}

function recalcTotal() {
    for (f in ADJUST) {
        var b = 0, d = 0; for (p in ADJUST[f].products) { var g = ADJUST[f].products[p].base_price, k = 0; for (a in ADJUST[f].products[p].attributes) { var c = ADJUST[f].products[p].attributes[a].match(pricemod_regex); if (c) switch (c[1]) { case ":": g = parseFloat(c[2]); break; case "+": k += parseFloat(c[2]); break; case "-": k -= parseFloat(c[2]) } } g += k; g *= ADJUST[f].products[p].quantity; b += g; d += ADJUST[f].products[p].quantity } "function" === typeof fcFormatPrice && (b = fcFormatPrice(b, f)); "function" === typeof fcFormatQuantity &&
            (d = fcFormatQuantity(d, f)); b = "object" == typeof FC && FC.hasOwnProperty("json") && FC.json.config.hasOwnProperty("currency_format") ? jQuery.trim(FC.util.money_format(FC.json.config.currency_format, b)) : b.formatMoney(2); $("." + f + "_total").html(b); $("." + f + "_total_quantity").html(d)
    }
}

Number.prototype.formatMoney = function (b, d, g) { var k = this; b = isNaN(b = Math.abs(b)) ? 2 : b; d = void 0 == d ? "." : d; g = void 0 == g ? "," : g; var c = 0 > k ? "-" : "", e = parseInt(k = Math.abs(+k || 0).toFixed(b)) + "", h = 3 < (h = e.length) ? h % 3 : 0; return c + (h ? e.substr(0, h) + g : "") + e.substr(h).replace(/(\d{3})(?=\d)/g, "$1" + g) + (b ? d + Math.abs(k - e).toFixed(b).slice(2) : "") };



// MARK: Trigger onload or on document.ready
function checkDeliveryDates() {
    if (deliveryDate === FC.json.custom_fields.deliveryDate.value) {
        console.log("Dates are in sync");
    } else {
        console.log("Dates are out of sync");
        FC.client.request('https://' + FC.settings.storedomain + '/cart?h:deliveryDate=' + deliveryDate + '&h:deliveryDate2=' + deliveryDate2).done(function (dataJSON) {
            console.log("added deliveryDateFC", FC.json.custom_fields.deliveryDate);
            console.log("added deliveryDate2FC", FC.json.custom_fields.deliveryDate2);
            deliveryDateFC = FC.json.custom_fields.deliveryDate.value;
            deliveryDate2FC = FC.json.custom_fields.deliveryDate2.value;
            //initButtons();
        });
    }
    // MARK: Need to do an init where I check if there are any delivery dates as custom fields in the FC.json, if not, I create one
    // MARK: Once custom fields for delivery date are in good condition, go ahead with the rest of the checks

    // If old delivery date, prompt user to select new date

    // Otherwise, update items for first upcoming date
    /* Can be used for storing dates as a custom field
     //Store chosen Date as custom session variable
     FC.client.request('https://' + FC.settings.storedomain + '/cart?h:chosenDate=' + chosenDateFC).done(function (dataJSON) {
            console.log("added chosenDateFC", chosenDateFC);
        });
    */
}
function checkAvailability(dataDay) {
    checkDeliveryDates();


    if (dataDay == "firstDeliveryDate") {
        deliveryDay = deliveryDate;
    } else {
        deliveryDay = deliveryDate2;
    }

    canShipOnDeliveryDay();

    function canShipOnDeliveryDay() {
        const cartItems = FC.json.items;

        // Not-available items array
        itemsNotAvailable = [];
        document.getElementById("unavailableItems").innerHTML = "";
        let unavailableItemsList = document.getElementById("unavailableItems");

        for (var i = 0; i < FC.json.items.length; i++) {

            var current = cartItems[i];
            const currentID = cartItems[i].id;

            if (current.name !== "Tip") {
                if (deliveryDay.includes("Tuesday") && current.options[2].value === 'false') {
                    itemsNotAvailable.push(current.name);

                    let li = document.createElement("li");
                    li.innerText = current.name;
                    unavailableItemsList.appendChild(li);
                } else if (deliveryDay.includes("Saturday") && current.options[3].value === 'false') {
                    itemsNotAvailable.push(current.name);

                    let li = document.createElement("li");
                    li.innerText = current.name;
                    unavailableItemsList.appendChild(li);
                }
            }
        }

        if (itemsNotAvailable.length !== 0) {
            displayDatePopUp();
        }
    }
}

function removeItemsNotAvailable() {
    const cartItems = FC.json.items;

    for (var i = 0; i < FC.json.items.length; i++) {

        var current = cartItems[i];
        const currentID = cartItems[i].id;

        if (current.name !== "Tip") {
            if (deliveryDay.includes("Tuesday") && current.options[2].value === 'false') {
                FC.client.request('https://' + FC.settings.storedomain + '/cart?&cart=update&quantity=0&id=' + currentID).done(function (dataJSON) {
                    FC.cart.updateItemQuantity();
                });
            } else if (deliveryDay.includes("Saturday") && current.options[3].value === 'false') {
                FC.client.request('https://' + FC.settings.storedomain + '/cart?&cart=update&quantity=0&id=' + currentID).done(function (dataJSON) {
                    FC.cart.updateItemQuantity();
                });
            }
        }
    }

    let newDeliveryDate = chosenDate;
    let firstDeliveryDate;
    let secondDeliveryDate;

    if (firstDay == "tuesday") {
        firstDeliveryDate = document.querySelector('[data-day="tuesday"]');
        secondDeliveryDate = document.querySelector('[data-day="saturday"]');
    } else {
        firstDeliveryDate = document.querySelector('[data-day="saturday"]');
        secondDeliveryDate = document.querySelector('[data-day="tuesday"]');
    }

    // Toggle Classes
    if (newDeliveryDate.includes(firstDeliveryDate.text)) {
        firstDeliveryDate.classList.add("active");
        secondDeliveryDate.classList.remove("active");
    } else if (newDeliveryDate.includes(secondDeliveryDate.text)) {
        firstDeliveryDate.classList.remove("active");
        secondDeliveryDate.classList.add("active");
    }

    displayDatePopUp();
}

function displayDatePopUp() {
    var x = document.getElementById("datePopUp");
    if (x.style.display === "flex") {
        x.style.display = "none";
    } else {
        x.style.display = "flex";
    }
}

function dismissDeliveryDateChange() {
    let newDeliveryDate = chosenDate;
    let firstDeliveryDate;
    let secondDeliveryDate;

    if (firstDay == "tuesday") {
        firstDeliveryDate = document.querySelector('[data-day="tuesday"]');
        secondDeliveryDate = document.querySelector('[data-day="saturday"]');
    } else {
        firstDeliveryDate = document.querySelector('[data-day="saturday"]');
        secondDeliveryDate = document.querySelector('[data-day="tuesday"]');
    }

    // Toggle Classes back to previous values
    if (newDeliveryDate.includes(firstDeliveryDate.text)) {
        firstDeliveryDate.classList.remove("active");
        secondDeliveryDate.classList.add("active");
    } else if (newDeliveryDate.includes(secondDeliveryDate.text)) {
        firstDeliveryDate.classList.add("active");
        secondDeliveryDate.classList.remove("active");
    }

    setDay();

    function setDay() {
        var day = localStorage.getItem("day");

        $(".addtocart").each(function () {
            console.log("editing addtocart item");
            var tuesday = $(this).attr("data-tuesday");
            var saturday = $(this).attr("data-saturday");

            // Reversing changes
            if (day == "saturday") {
                if (tuesday == "true") {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            } else if (day == "tuesday") {
                if (saturday == "true") {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            }
        });

        // Revert day to previous state
        if (deliveryDate.includes("Tuesday")) {
            firstDay = "tuesday";
        } else {
            firstDay = "saturday";
        }

        if (firstDay == "tuesday") {
            if (day == "tuesday") {
                chosenDateFC = deliveryDate2;
                chosenDate = deliveryDate2;
                localStorage.setItem("day", "saturday");
            } else if (day == "saturday") {
                chosenDateFC = deliveryDate;
                chosenDate = deliveryDate;
                localStorage.setItem("day", "tuesday");
            }
        } else {
            if (day == "saturday") {
                chosenDateFC = deliveryDate2;
                chosenDate = deliveryDat2;
                localStorage.setItem("day", "tuesday");
            } else if (day == "tuesday") {
                chosenDateFC = deliveryDate;
                chosenDate = deliveryDate;
                localStorage.setItem("day", "saturday");
            }
        }

        FC.client.request('https://' + FC.settings.storedomain + '/cart?h:chosenDate=' + chosenDateFC).done(function (dataJSON) {
            console.log("added chosenDateFC", chosenDateFC);
        });
    }

    displayDatePopUp();
}