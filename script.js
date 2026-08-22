// @ts-nocheck

let cart = [];

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name: name, price: price, qty: 1 });
    }
    renderCart();
}

function updateQty(name, change) {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
    }
    renderCart();
}

function renderCart() {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalContainer = document.getElementById("cartTotal");
    const mobileCount = document.getElementById("mobileCartCount");
    const mobileTotal = document.getElementById("mobileCartTotal");
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-text">Keranjang masih kosong. Pilih menu di atas!</p>';
        cartTotalContainer.textContent = "Rp 0";
        if(mobileCount) mobileCount.textContent = "0 Menu";
        if(mobileTotal) mobileTotal.textContent = "Rp 0";
        return;
    }

    let html = "";
    let total = 0;
    let totalQty = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        totalQty += item.qty;

        html += `
            <div class="cart-item-row">
                <div>
                    <strong>${item.name}</strong>
                    <br><small>@ Rp ${item.price.toLocaleString('id-ID')}</small>
                </div>
                <div class="cart-item-controls">
                    <button onclick="updateQty('${item.name}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="updateQty('${item.name}', 1)">+</button>
                </div>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = html;
    cartTotalContainer.textContent = `Rp ${total.toLocaleString('id-ID')}`;

    if(mobileCount) mobileCount.textContent = `${totalQty} Menu Ditambah`;
    if(mobileTotal) mobileTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

function scrollToCart() {
    document.getElementById("cartSection").scrollIntoView({ behavior: 'smooth' });
}

function checkoutWA() {
    if (cart.length === 0) {
        alert("Pilih minimal 1 menu dulu sebelum checkout!");
        return;
    }

    const name = document.getElementById("custName").value.trim();
    const note = document.getElementById("custNote").value.trim();

    if (!name) {
        alert("Mohon isi Nama Pemesan terlebih dahulu!");
        return;
    }

    if (!note) {
        alert("Mohon isi Catatan / Posisi Diri agar lokasi pengantaran jelas!");
        return;
    }

    let text = `Halo CALF Coffee, saya mau pesan:\n\n`;
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        text += `• ${item.name} (${item.qty}x) = Rp ${itemTotal.toLocaleString('id-ID')}\n`;
    });

    text += `\n*Total:* Rp ${total.toLocaleString('id-ID')}\n`;
    text += `*Nama:* ${name}\n`;
    text += `*Catatan/Posisi:* ${note}\n\n`;
    text += `Mohon diproses ya, terima kasih!`;

    const encodedText = encodeURIComponent(text);
    const waNumber = "6283871434880";
    window.open(`https://wa.me/${waNumber}?text=${encodedText}`, "_blank");
}
