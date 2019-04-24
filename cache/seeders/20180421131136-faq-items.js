'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkInsert('Faqs', Array.apply(null, {length: 28}).map((v, i) => {
      if (i <= 10) {
        return {id: i+1, section: 1, sort: i};
      } else if (i <= 21) {
        return {id: i+1, section: 2, sort: i - 11};
      } else {
        return {id: i+1, section: 3, sort: i - 22};
      }
    }));
    return queryInterface.bulkInsert('Translations', [
      {lang: 'en', identifier: 'FAQ__QUESTION__1', phrase: 'Ok, I want to exchange some cryptocurrency. Does it mean you will get access to my wallet?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__1', phrase: `
No. You will receive an address and can send your cryptocurrency from there by yourself. Smartjex won’t demand any access.

And you can never be too thorough: don’t your seed phrase, your private key and password to anybody! 
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__2', phrase: 'How will I know that I am on the official site?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__2', phrase: `
Look at the address bar: the official Smartjex site has a secure https://, security mark, and its one and only address is [https://smartjex.com]
      `},


      {lang: 'en', identifier: 'FAQ__QUESTION__3', phrase: 'How do you know the best rate?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__3', phrase: `
Our algorithms examine rates and fees according to the amount exchanged and compare  it to 4 platforms (exchanges, etc.) in order to calculate the best rate.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__4', phrase: 'What is a “bottom offer”?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__4', phrase: `
It is the most unprofitable available offer. It helps you see the difference between it and the most profitable offer.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__5', phrase: 'What is a “minimum amount”?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__5', phrase: `
It is the lowest amount of the selected crypto you can exchange. Note that the amount is different for every coin/token. It depends on the transaction fee, the platforms’ specifications and fees, and your required quantity of the crypto.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__6', phrase: 'What does “I save 25%” mean?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__6', phrase: `
It means the margin between the bottom and the top offer, according to your demand.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__7', phrase: 'Why do you offer different options if there is always the best one?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__7', phrase: `
By giving different options we provide our users an overview of the state of things. Also to let them choose according to their preferences.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__8', phrase: 'What does “in USD” mean?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__8', phrase: `
You can set the estimated amount you want to exchange in US dollars (USD). We will recalculate it in crypto.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__9', phrase: 'What means “needs limit adjust”?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__9', phrase: `
We suggest every possible way to exchange your crypto. If the platforms follow everything else except the primarily set amount, there will be a hint on how you can change it to include it in the platform, if you decide to.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__10', phrase: 'Why are different platforms offered every time?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__10', phrase: `
Some platforms don’t support chosen pairs or could be unavailable – we suggest only selected list, to save your time and money!
      `},

      // details
      {lang: 'en', identifier: 'FAQ__QUESTION__11', phrase: 'How do you know when I sent you my coins?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__11', phrase: `
We create a unique address for every demand. You will get the hash-code (encrypted details of the transaction) to check it on the blockchain if you wish.

We check and refresh the status every 60 seconds. As a rule, this is enough, but in rare cases it can take longer (3-4 checkups)
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__12', phrase: 'Can I get new coins sent directly to my exchange address?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__12', phrase: `
Yes, you can set the exchange deposit address and we will send your coins there. Go to Profile > Deposit/Withdrawals and choose the Deposit address for the selected currency.

Notice that in this case the transaction could take longer.

We also suggest checking  the withdrawal limit for each coin because different exchanges have different rules on how much crypto can be exchanged. It is important for your holdings to not to be “held back”.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__13', phrase: 'Can I deposit coins from an exchange?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__13', phrase: `
Yes, you can, but be aware of additional fees and a prolonged period of time.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__14', phrase: 'Tell me more about the fees'},
      {lang: 'en', identifier: 'FAQ__ANSWER__14', phrase: `
There are exchange platforms’ fees – the reward that a platform demands for its service. Smartjex examines all this data and comes up with the best overall option.

And there are network fees which let the blockchain operate. You will see it directly in your account.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__15', phrase: 'How long will the transaction take?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__15', phrase: `
15-60 minutes overall, 30 minutes on average.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__16', phrase: 'What if the rate changes during the operation?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__16', phrase: `
We consider a ~10% safety margin to cover the possible rate volatility when a transaction in process. You will get 100% of the funds available  exchanged at the moment of transaction.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__17', phrase: 'I calculated that I will receive one amount of crypto, but I got a slightly different amount – why?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__17', phrase: `
This is because of volatility. The rate is extremely volatile due to macroeconomic reasons. For example, Bitcoin (BTC) rate changes within 1% every second. Don’t buy the exact amount of crypto you need, but leave some room for error.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__18', phrase: 'What is a refund address?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__18', phrase: `
It is the address where you store the coins you want to exchange. For example, if you have BTC and want to get DogeCoin (DOGE), your refund address will be your BTC address.

It is not necessary for it to be  the same address or wallet you send BTC from.

If something goes wrong and the operation is called off, we will send your initial cryptocurrency to this address. There is an extremely low probability of this occurring, but to be safe, we provide a refund address.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__19', phrase: 'What is a destination address?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__19', phrase: `
It is the address where you will receive coins after exchange is made. For example, if you have BTC and want to exchange it for DOGE, your destination address would be your DOGE address.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__20', phrase: 'What if I put the wrong address?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__20', phrase: `
We have the initial check for the address and to correlate with selected crypto currencies (e.g. Bitcoin Cash (BCC) address to start with its prefix, etc.), but if you make mistake, you risk sending your funds to a stranger or lose them in blockchain forever. This operation is irreversible.

To avoid mistakes, do not copy your address, but manually, use the “copy” button: {copy_button}
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__21', phrase: 'Why can\'t I change the cryptocurrency’s destination during step three?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__21', phrase: `
Once you chose the desired pair, we show you the conditions and benefits. Since you accept it, we focus on the very transaction details so you won’t be confused by the extra data. Therefore, you will be able to fill in your addresses correctly.

If you want to exchange other cryptocurrencies, please visit the previous steps and make choice again.
      `},

//       // summary
      {lang: 'en', identifier: 'FAQ__QUESTION__22', phrase: 'What is an “order ID”?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__22', phrase: `
It is the unique access address link to the operation report. You need it to check the status of the operation. You can also send the link to your email.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__23', phrase: 'Can I refresh the page or close my browser window?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__23', phrase: `
Yes, you can, and it won’t affect anything. You can always reopen the summary step.

If you closed the tab by accident, but haven’t saved the link, the quickest way to restore it is to press SHIFT+CMD/CTRL+T.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__24', phrase: 'What does “view on blockchain” mean?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__24', phrase: `
Once the cryptocurrency is sent, every transaction is written on blockchain and the information is stored there forever.

A unique reference to the transaction called “hash” is created and you can track its status there.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__25', phrase: 'What does QR-code redeem?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__25', phrase: `
We create a unique address and a unique QR-code for every transaction.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__26', phrase: 'What if I send the crypto two times?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__26', phrase: `
We will send you the exchanged amount twice, your money will not be lost.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__27', phrase: 'What if I send a higher or lower amount of crypto than the one I originally stated?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__27', phrase: `
If you send more than you initially set, we will exchange all the funds.

If you send less than you initially set, but over the minimum, we will exchange the funds.

If you send less than the necessary minimum, the transaction won’t work and you’ll be refunded. Please, consider the announced minimum amount.
      `},

      {lang: 'en', identifier: 'FAQ__QUESTION__28', phrase: 'How do I know the operation is complete?'},
      {lang: 'en', identifier: 'FAQ__ANSWER__28', phrase: `
You will see the “All done” status in the Summary page. Or you can check your brand-new coins/tokens in your wallet.

As a rule, the exchange process takes about 15-60 min depending on the network load and selected platforms.
      `},
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    var Op = Sequelize.Op;
    await queryInterface.bulkDelete('Faqs', null, {});
    return queryInterface.bulkDelete('Translations', {
      identifier: {
        [Op.or]: [
          {[Op.like]: 'FAQ\_\_QUESTION\_\_%'},
          {[Op.like]: 'FAQ\_\_ANSWER\_\_%'}
        ]
      }
    }, {});
  }
};
