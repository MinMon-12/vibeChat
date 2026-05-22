const bcrypt = require('bcryptjs');

(async () => {
  const plainText = "mingopassword1234";
  const hashedText = await bcrypt.hash(plainText, 10);

  console.log(hashedText);
})();

