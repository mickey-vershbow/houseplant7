const axios = require('axios');

(async () => {
  const data = await axios(
    "https://trefle.io/api/v1/genus?token=s8drF5lfAM1u6ZQEjpl7y1Nw9hwJN3ms5F717muNPoE"
  );
  console.log(data);
})();
