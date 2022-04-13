$(document).ready(function () {

    // Init state, show tuesday, hide saturday
    // MARK: Need to refactor to handle Fri & Saturday
    $(".product-content-tuesday").show();
    $(`.product-content-${friOrSat}`).hide();

    // Check for previously chosen day
    if (!localStorage.getItem("day")) {
        localStorage.setItem("day", firstDay);
    }

    var chosenDay = localStorage.getItem("day");

    let chosenDateFC = "";

    if (firstDay == "tuesday") {
        if (chosenDay == "tuesday") {
            chosenDateFC = deliveryDate;
        } else if (chosenDay == ('friday' || 'saturday')) {
            chosenDateFC = deliveryDate2;
        }
    } else {
        if (chosenDay == ('friday' || 'saturday')) {
            chosenDateFC = deliveryDate;
        } else if (chosenDay == "tuesday") {
            chosenDateFC = deliveryDate2;
        }
    }

    $(".btn[data-day='" + chosenDay + "']").addClass("active");
    if (chosenDay == "tuesday") {
        $(".product-tuesday-content").show();
        $(`.product-content-${friOrSat}`).hide();
    // MARK: Need to refactor to handle Fri & Saturday
    } else if (chosenDay == ('friday' || 'saturday')) {
        $(".product-tuesday-content").hide();
        $(`.product-content-${friOrSat}`).show();
    }

    // Choose day
    $(".btn").click(function () {
        console.log("Choosing day");
        $(".btn").removeClass("active");
        $(this).addClass("active");
        var day = $(this).attr("data-day");

        localStorage.setItem("day", day);

        if (firstDay == "tuesday") {
            if (day == "tuesday") {
                chosenDateFC = deliveryDate;
                chosenDate = deliveryDate;
                $(".product-tuesday-content").show();
                $(`.product-content-${friOrSat}`).hide();
            } else if (day == ('friday' || 'saturday')) {
                chosenDateFC = deliveryDate2;
                chosenDate = deliveryDate2;
                $(".product-tuesday-content").hide();
                $(`.product-content-${friOrSat}`).show();
            }
        } else {
            if (day == ('friday' || 'saturday')) {
                chosenDateFC = deliveryDate;
                chosenDate = deliveryDate;
                $(".product-tuesday-content").hide();
                $(`.product-content-${friOrSat}`).show();
            } else if (day == "tuesday") {
                chosenDateFC = deliveryDate2;
                chosenDate = deliveryDate2;
                $(".product-tuesday-content").show();
                $(`.product-content-${friOrSat}`).hide();
            }
        }

        //Store chosen Date as custom session variable
        FC.client.request('https://' + FC.settings.storedomain + '/cart?h:chosenDate=' + chosenDateFC).done(function (dataJSON) {
            console.log("added chosenDateFC", chosenDateFC);
        });

    });

    // Add input quantity
    console.log("Added input quantity")

    // Set delivery date buttons text
    document.getElementById("deliveryDate").text = deliveryDate;
    document.getElementById("deliveryDate2").text = deliveryDate2;
    document.getElementById("deliveryDate").dataset.day = firstDay;
    document.getElementById("deliveryDate2").dataset.day = secondDay;
    console.log("completed setting up button text: ", deliveryDate, deliveryDate2);
});