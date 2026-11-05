// Review wall: two marquee rows of placeholder reviews (replace with real ones — see README).
(function () {
  const R = [
    ["Priya S.", "The flat white is genuinely the best in town. Ordering ahead means I'm in and out in 30 seconds.", 5],
    ["Marcus T.", "Cozy corner, great Wi-Fi, and the croissants are dangerously good.", 5],
    ["Elena R.", "Their oat latte doesn't taste like an afterthought. Finally!", 5],
    ["Jordan K.", "Pour over changes every week and the baristas actually explain the beans.", 5],
    ["Aisha M.", "The Ember Club card got me a free mocha. I've been back four times this week.", 5],
    ["Tom W.", "Cold brew is smooth, chocolatey, never bitter. My summer fuel.", 4],
    ["Sofia L.", "Took the quiz on a whim, got an iced matcha, now it's my thing.", 5],
    ["Dev P.", "Friendly staff who remember your order. That's rare.", 5],
    ["Hannah B.", "Avocado toast + americano is my Saturday ritual now.", 5],
    ["Chris O.", "Great music, warm lighting, and the chai is properly spiced.", 4],
  ];
  const card = ([n, t, s]) => `
    <figure class="review">
      <div class="stars" aria-label="${s} out of 5 stars">${"★".repeat(s)}${"☆".repeat(5 - s)}</div>
      <blockquote>“${t}”</blockquote>
      <figcaption><span class="avatar" aria-hidden="true">${n[0]}</span>${n}</figcaption>
    </figure>`;
  const rows = [R.slice(0, 5), R.slice(5)];
  document.getElementById("review-rows").innerHTML = rows.map((r, i) => `
    <div class="marquee ${i ? "reverse" : ""}">
      <div class="marquee-track">${r.map(card).join("")}${r.map(card).join("").replace(/<figure/g, '<figure aria-hidden="true"')}</div>
    </div>`).join("");
})();
