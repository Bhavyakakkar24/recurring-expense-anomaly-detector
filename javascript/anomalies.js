// ==========================================
// EXPENSEGUARD - ANOMALIES PAGE
// ==========================================


document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderAnomaliesPage();

    }
);


// ==========================================
// MAIN FUNCTION
// ==========================================

function renderAnomaliesPage() {

    const transactions =
        analyzeTransactions(
            getTransactions()
        );


    const anomalies =
        transactions.filter(
            transaction => transaction.isAnomaly
        );


    updateAnomalyStats(anomalies);

    renderAnomalyCards(anomalies);

}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateAnomalyStats(anomalies) {


    // TOTAL ANOMALIES

    const totalElement =
        document.querySelector(
            ".stat-card:nth-child(1) .stat-value"
        );


    if (totalElement) {

        totalElement.textContent =
            anomalies.length;

    }


    // HIGHEST ANOMALY

    const highestAmount =
        anomalies.length > 0

            ? Math.max(
                ...anomalies.map(
                    transaction =>
                        Number(transaction.amount)
                )
            )

            : 0;


    const highestAmountElement =
        document.querySelector(
            ".stat-card:nth-child(2) .stat-value"
        );


    if (highestAmountElement) {

        highestAmountElement.textContent =
            "₹" +
            highestAmount.toLocaleString("en-IN");

    }


    // HIGHEST Z-SCORE

    const highestZScore =
        anomalies.length > 0

            ? Math.max(
                ...anomalies.map(
                    transaction =>
                        Math.abs(transaction.zScore)
                )
            )

            : 0;


    const highestZScoreElement =
        document.querySelector(
            ".stat-card:nth-child(3) .stat-value"
        );


    if (highestZScoreElement) {

        highestZScoreElement.textContent =
            highestZScore.toFixed(2);

    }


    // TOTAL ANOMALY SPENDING

    const anomalySpending =
        anomalies.reduce(
            (sum, transaction) =>
                sum + Number(transaction.amount),
            0
        );


    const spendingElement =
        document.querySelector(
            ".stat-card:nth-child(4) .stat-value"
        );


    if (spendingElement) {

        spendingElement.textContent =
            "₹" +
            anomalySpending.toLocaleString("en-IN");

    }


    // SUBTEXTS

    const cards =
        document.querySelectorAll(
            ".stat-card"
        );


    if (cards[0]) {

        const text =
            cards[0].querySelector(
                ".stat-change"
            );

        if (text) {

            text.textContent =
                anomalies.length > 0
                    ? "Requires attention"
                    : "No anomalies";

        }

    }


    if (cards[1]) {

        const text =
            cards[1].querySelector(
                ".stat-change"
            );

        if (text) {

            text.textContent =
                anomalies.length > 0
                    ? "Highest unusual expense"
                    : "No anomalies";

        }

    }


    if (cards[2]) {

        const text =
            cards[2].querySelector(
                ".stat-change"
            );

        if (text) {

            text.textContent =
                anomalies.length > 0
                    ? "Highly unusual"
                    : "No anomalies";

        }

    }


    if (cards[3]) {

        const text =
            cards[3].querySelector(
                ".stat-change"
            );

        if (text) {

            text.textContent =
                `Across ${anomalies.length} transactions`;

        }

    }

}


// ==========================================
// RENDER ANOMALY CARDS
// ==========================================

function renderAnomalyCards(anomalies) {


    const container =
        document.querySelector(
            ".detected-anomalies-list"
        );


    if (!container) {

        console.error(
            "Add class 'detected-anomalies-list' to your anomaly list container."
        );

        return;

    }


    container.innerHTML = "";


    if (anomalies.length === 0) {

        container.innerHTML = `

            <div class="no-anomalies">

                <div class="no-anomalies-icon">
                    ✓
                </div>

                <h3>
                    No anomalies detected
                </h3>

                <p>
                    Your transactions are currently
                    within your normal spending pattern.
                </p>

            </div>

        `;

        return;

    }


    anomalies
        .slice()
        .reverse()
        .forEach(transaction => {

            const card =
                document.createElement("div");


            card.className =
                "detected-anomaly-card";


            card.innerHTML = `

                <div class="anomaly-card-header">

                    <div>

                        <h3>

                            🚨 Unusually High
                            ${escapeHTML(transaction.category)}
                            Expense

                        </h3>

                        <p>

                            ${escapeHTML(
                                transaction.description
                            )}

                        </p>

                    </div>


                    <strong class="anomaly-card-amount">

                        ₹${Number(transaction.amount)
                            .toLocaleString("en-IN")}

                    </strong>

                </div>


                <div class="anomaly-card-info">

                    <span>

                        📅
                        ${formatDate(transaction.date)}

                    </span>


                    <span>

                        Category:
                        ${escapeHTML(
                            transaction.category
                        )}

                    </span>


                    <span class="z-score">

                        Z-Score:
                        ${transaction.zScore.toFixed(2)}

                    </span>

                </div>


                <div class="anomaly-reason">

                    <strong>
                        Why was this flagged?
                    </strong>

                    <p>

                        This expense is significantly
                        higher than your normal
                        ${escapeHTML(transaction.category)}
                        spending.

                    </p>

                </div>


                <button

                    class="view-transaction-btn"

                    onclick="showAnomalyDetails(
                        ${transaction.id}
                    )"

                >

                    View Transaction

                    <span>
                        →
                    </span>

                </button>

            `;


            container.appendChild(card);

        });

}


// ==========================================
// SHOW ANOMALY DETAILS
// ==========================================

function showAnomalyDetails(id) {

    const transactions =
        analyzeTransactions(
            getTransactions()
        );


    const transaction =
        transactions.find(
            item => item.id === id
        );


    if (!transaction) {
        return;
    }


    alert(

        "ANOMALY DETAILS\n\n" +

        "Description: " +
        transaction.description +

        "\n\nAmount: ₹" +
        transaction.amount +

        "\n\nCategory: " +
        transaction.category +

        "\n\nDate: " +
        formatDate(transaction.date) +

        "\n\nMean of category: ₹" +
        calculateMean(

            transactions

                .filter(
                    item =>
                        item.category ===
                        transaction.category
                )

                .map(
                    item =>
                        Number(item.amount)
                )

        ).toFixed(2) +

        "\n\nZ-Score: " +
        transaction.zScore +

        "\n\nThreshold: ±2.00" +

        "\n\nResult: ANOMALY"

    );

}