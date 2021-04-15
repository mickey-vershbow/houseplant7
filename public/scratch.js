const axios = require('axios');


(async () => {
  const response = await axios(
    "https://trefle.io/api/v1/plants?token=s8drF5lfAM1u6ZQEjpl7y1Nw9hwJN3ms5F717muNPoE"
  );
  const plants = response.data.data.author;
  console.log(plants);
})();
