'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Translations', [
      // Home
      {lang: 'en', identifier: 'HOME__META__TITLE', phrase: 'Smartjex - convert {NN} cryptocurrencies at their best rates.\nHere & now.'},
      {lang: 'en', identifier: 'HOME__META__KEYWORDS', phrase: 'smartjex, convert, cryptocurrencies'},
      {lang: 'en', identifier: 'HOME__META__DESCRIPTION', phrase: 'Smartjex examines different exchanges and provides the best offers in regards to amount, fees and speed, and allows them to be anonymously transacted right from your wallet.'},

      {lang: 'en', identifier: 'HOME__PAGE__TITLE', phrase: 'Convert {NN} cryptocurrencies at their best rates.\nHere & now.'},
      {lang: 'en', identifier: 'HOME__PAGE__SUBTITLE', phrase: 'Smartjex examines different exchanges and provides the best offers in regards to amount, fees and speed, and allows them to be anonymously transacted right from your wallet.'},

      // About
      {lang: 'en', identifier: 'ABOUT__MENU__ITEM', phrase: 'About us'},

      {lang: 'en', identifier: 'ABOUT__META__TITLE', phrase: 'About meta title'},
      {lang: 'en', identifier: 'ABOUT__META__KEYWORDS', phrase: 'About meta keywords'},
      {lang: 'en', identifier: 'ABOUT__META__DESCRIPTION', phrase: 'About meta description'},

      {lang: 'en', identifier: 'ABOUT__PAGE__TITLE', phrase: 'About page title'},
      {lang: 'en', identifier: 'ABOUT__PAGE__SUBTITLE', phrase: 'About page subtitle'},
      {lang: 'en', identifier: 'ABOUT__PAGE__CONTENT', phrase: `
We are an independent IT-department, split from a company with 4 years of hands-on experience in cryptomarkets. Our mission is to deal with routine and create new ways of implementing cryptocurrency into practice by developing blockchain-based products.

We underpin the needs of the market and try to offer brand-new or upgraded solutions to be used as the new status quo.

Last year appeared to be the year of altcoins. Thus, it is necessary to have a tool to easily send and receive any currency, converted one into another. That is why we created Smartjex — multiconverter, our fourth crypto-specialized project, designed to raise cryptocurrency exchange to new levels of clarity and comfort. Smartjex can exchange bitcoins or any crypto, calculates the best rates, and quickly send it directly to your wallet.

Stay tuned!
      `},

      {lang: 'en', identifier: 'CONTACT_FORM__TITLE', phrase: 'Contact form'},
      {lang: 'en', identifier: 'CONTACT_FORM__EMAIL_FIELD__LABEL', phrase: 'E-mail'},
      {lang: 'en', identifier: 'CONTACT_FORM__NAME_FIELD__LABEL', phrase: 'Name'},
      {lang: 'en', identifier: 'CONTACT_FORM__SUBJECT_FIELD__LABEL', phrase: 'Subject'},
      {lang: 'en', identifier: 'CONTACT_FORM__MESSAGE_FIELD__LABEL', phrase: 'Enter text...'},
      {lang: 'en', identifier: 'CONTACT_FORM__SUBMIT_BTN__LABEL', phrase: 'Send'},

      // Privacy
      {lang: 'en', identifier: 'PRIVACY__MENU__ITEM', phrase: 'Privacy Policy'},

      {lang: 'en', identifier: 'PRIVACY__META__TITLE', phrase: 'Privacy meta title'},
      {lang: 'en', identifier: 'PRIVACY__META__KEYWORDS', phrase: 'Privacy meta keywords'},
      {lang: 'en', identifier: 'PRIVACY__META__DESCRIPTION', phrase: 'Privacy meta description'},

      {lang: 'en', identifier: 'PRIVACY__PAGE__TITLE', phrase: 'Privacy page title'},
      {lang: 'en', identifier: 'PRIVACY__PAGE__SUBTITLE', phrase: 'Privacy page subtitle'},
      {lang: 'en', identifier: 'PRIVACY__PAGE__CONTENT', 
        phrase: 'Smartjex.com (“smartjex.com” or “we”) controls and provides access to the smartjex.com website, currently located at www.smartjex.com (the “Website”).\n\n'
          + 'At smartjex.com, we are fully committed to respecting your privacy and to protecting any information that our clients provide. Your privacy and security are both our highest priorities and we make every effort to ensure that all the information provided by you is protected. This Privacy Policy (the “Policy”) is designed to inform you about the terms of treating your personal data.\n\n'
          + '## Personal Information\n\n'
          + 'In order to access the functionality of the Website, you will need to register. When registering, you will be asked to provide an email address and create a password. You may also choose to link to the Website using one of your accounts on the social networks, such as Twitter, Facebook and Google+.\n\n'
          + '## Record Collection\n\n'
          + 'From the moment you register on smartjex.com, our software will start collecting your non-personal identification information. Such information may include your browser’s name and technical information about your means of connection to our Website, in particular the operating system and the Internet service providers used among other similar information.\n\n'
          + '## Contacting us\n\n'
          + 'If you have any questions about this Privacy Policy or the rules of smartjex.com, please contact us at: [support@smartjex.com](mailto:support@smartjex.com)\n\n'
      },

      // terms of use
      {lang: 'en', identifier: 'TERMS__MENU__ITEM', phrase: 'Terms of Use and Privacy Policy'},

      {lang: 'en', identifier: 'TERMS__META__TITLE', phrase: 'Terms of Use and Privacy Policy'},
      {lang: 'en', identifier: 'TERMS__META__KEYWORDS', phrase: 'terms, privacy'},
      {lang: 'en', identifier: 'TERMS__META__DESCRIPTION', phrase: 'Terms of Use meta description'},

      {lang: 'en', identifier: 'TERMS__PAGE__TITLE', phrase: 'Terms of Use and Privacy Policy'},
      {lang: 'en', identifier: 'TERMS__PAGE__SUBTITLE', phrase: 'Detailed conditions'},
      {lang: 'en', identifier: 'TERMS__PAGE__CONTENT', 
        phrase: `
By using the Website <https://smartjex.com/> and further by accepting to avail the services offered by the Website (“**Service**”), You are hereby agreeing to accept and comply with the terms and conditions of use stated herein below (“**Terms of Use**”).
These Terms of Service, the Privacy and Transparency Statement (the “Terms”) and any and all other agreements between Smartjex and its users will use the following definitions:
a. “Customer”,  “user”,  “client”, “you”,  and “our” refers to the person or entity accessing and/or using Smartjex. 

b. “Company”, “Smartjex”, “Website”, “Service”, “we” and “us” collectively refers to the online website and all products using the Smartjex API, its owners, directors, officers, employees, operators, agents, insurers, suppliers, and attorneys.

d. “Asset,” “digital asset,” “coin,” “cryptocurrency,” “funds,” “good,” “ledger entry,” and “token” refer to blockchain-based software ledger data entries - new records that are produced by miners.

e. “Partners” are the services we conduct the exchange operation throughout their API.

  1. Smartjex is registered in Cyprus. We offer intermediary services, we do not conduct Financial operations by ourselves.
  2. By accessing the website, you agree to be bound by our Terms and all applicable laws, rules and regulations, and you agree that you are responsible for compliance with it, and that you are compliant with, all applicable laws, rules, and regulations. **If you do not agree with any of our Terms, you must stop using the Website.**
  3. Any use of the Website implies your deemed acceptance of our Terms.
  4. By using the Website, you prove that you are at least 18 years old, and is fully entitled to contract under applicable law, complying with and obeying all applicable laws, rules and regulations both of your country of Residence and Smartjex’s domain of jurisdiction (“Legislation”). 
  5. If you violate Terms or Legislation, we have the right to refuse operations and not to refund your Assets.
  6. You warrant to use your own digital wallets, their addresses (“Wallet”), and Assets. You must not use someone else's Wallet or Assets. 
  7. You are prohibited from using or accessing Smartjex in an abusive manner. This may include, without limitation and in Smartjex's sole discretion, submission of transactions or other data which imposes an unreasonable or unmanageably large load on the Smartjex platform, whether or not it interferes with normal operations.
  8. We are not responsible for changing the exchange rate due to the volatility of the market. We consider the course at the time of sending, accurate to 90 seconds. We take the data from the Partnets’ sites through their API. We cannot predict how long the transaction will take and cannot state the ultimate amount of Assets you get. 
  9. We will return your initial Assets on the Stated Wallet if the exchange operation does not pass during 72 hours.
  10. Nothing on the Site, blog, or any side-projects is a financial advice or recommendation for investment. We are not responsible for the security of Coins and Tokens, offered by the Partners.
  11. You are responsible for the accuracy of specifying the wallet data, because otherwise we will not be able to return, transfer and conduct other transactions.
  12. We take a one-sided decision about the return of funds and the value calculation factor. You can not appeal against it. You agree with it.
  13. We are not responsible for the twin scams of the site or related services. We advise you to check that the address is <https://smartjex.com/>.
  14. All disagreements are resolved according to the laws of Cryprus.
  15. We have the right to change the offer without notifying about its changes.
        `
      },

      // Coins
      {lang: 'en', identifier: 'CURRENCIES__MENU__ITEM', phrase: 'Supported currency'},

      {lang: 'en', identifier: 'CURRENCIES__META__TITLE', phrase: 'Coins meta title'},
      {lang: 'en', identifier: 'CURRENCIES__META__KEYWORDS', phrase: 'Coins meta keywords'},
      {lang: 'en', identifier: 'CURRENCIES__META__DESCRIPTION', phrase: 'Coins meta description'},

      {lang: 'en', identifier: 'CURRENCIES__PAGE__TITLE', phrase: 'Supported currency'},
      {lang: 'en', identifier: 'CURRENCIES__PAGE__SUBTITLE', phrase: 'We are now supporting over {count} cryptocurrencies to trade across all major exchanges'},
      {lang: 'en', identifier: 'CURRENCIES__SEARCH_FIELD__PLACEHOLDER', phrase: 'Search currencies'},
      {lang: 'en', identifier: 'CURRENCIES__TABLE__COLUMN__NAME_AND_SYMBOL', phrase: 'Name & Symbol'},
      {lang: 'en', identifier: 'CURRENCIES__TABLE__COLUMN__RATE', phrase: 'Rate'},
      {lang: 'en', identifier: 'CURRENCIES__TABLE__COLUMN__1_HOUR_CHANGES', phrase: '1h'},
      {lang: 'en', identifier: 'CURRENCIES__TABLE__COLUMN__24_HOURS_CHANGES', phrase: '24h'},
      {lang: 'en', identifier: 'CURRENCIES__TABLE__COLUMN__7_DAYS_CHANGES', phrase: '7d'},
      {lang: 'en', identifier: 'CURRENCIES__TABLE__EXCHANGE_BUTTON', phrase: 'Exchange {currency}'},


      // faq
      {lang: 'en', identifier: 'FAQ__MENU__ITEM', phrase: 'FAQ'},

      {lang: 'en', identifier: 'FAQ__META__TITLE', phrase: 'FAQ meta title'},
      {lang: 'en', identifier: 'FAQ__META__KEYWORDS', phrase: 'FAQ meta keywords'},
      {lang: 'en', identifier: 'FAQ__META__DESCRIPTION', phrase: 'FAQ meta description'},

      {lang: 'en', identifier: 'FAQ__PAGE__TITLE', phrase: 'FAQ'},
      {lang: 'en', identifier: 'FAQ__PAGE__SUBTITLE', phrase: 'Basic questions and answers'},

      {lang: 'en', identifier: 'FAQ__HAVE_QUESTION__TITLE', phrase: 'Your issue not listed here?'},
      {lang: 'en', identifier: 'FAQ__HAVE_QUESTION__CONTENT', phrase: 'You have a problem or a question about our service?'},
      {lang: 'en', identifier: 'FAQ__HAVE_QUESTION__CONTACT_BUTTON', phrase: 'Reach us'},

      {lang: 'en', identifier: 'FAQ__SECTION__STEP_1__TITLE', phrase: 'Step 1. Offers'},
      {lang: 'en', identifier: 'FAQ__SECTION__STEP_2__TITLE', phrase: 'Step 2. Details'},
      {lang: 'en', identifier: 'FAQ__SECTION__STEP_3__TITLE', phrase: 'Step 3. Summary'},

      




      // track order
      {lang: 'en', identifier: 'TRACK_ORDER__INPUT_PLACEHOLDER', phrase: 'Enter the order ID'},
      {lang: 'en', identifier: 'TRACK_ORDER__SUBMIT_BTN', phrase: 'Track'},
      {lang: 'en', identifier: 'TRACK_ORDER__MENU_ITEM', phrase: 'Tack order'},


      // advantage section
      {lang: 'en', identifier: 'ADVANTAGE__SECTION__TITLE', phrase: 'Advantages'},

      {lang: 'en', identifier: 'ADVANTAGE__ITEM__TRUSTY__TITLE', phrase: 'Trusty'},
      {lang: 'en', identifier: 'ADVANTAGE__ITEM__TRUSTY__CONTENT', phrase: 'We do not run the exchange — it is processed by the trusted platforms. Smartjex serve only as interface and compilation of these platforms.'},

      {lang: 'en', identifier: 'ADVANTAGE__ITEM__ANONYMOUS__TITLE', phrase: 'Anonymous'},
      {lang: 'en', identifier: 'ADVANTAGE__ITEM__ANONYMOUS__CONTENT', phrase: 'We neither request nor store your personal data. All we need is your wallet address for target coins.'},

      {lang: 'en', identifier: 'ADVANTAGE__ITEM__FAST__TITLE', phrase: 'Fast'},
      {lang: 'en', identifier: 'ADVANTAGE__ITEM__FAST__CONTENT', phrase: 'Simple three-step process: 1) pick the necessary cryptocurrency, 2) fill in the wallet address, 3) send the initial crypto to any given wallet. That’s it!'},

      {lang: 'en', identifier: 'ADVANTAGE__ITEM__FAIR__TITLE', phrase: 'Fair'},
      {lang: 'en', identifier: 'ADVANTAGE__ITEM__FAIR__CONTENT', phrase: 'There is no hidden exchange fees – you pay just the platforms’ fee, already included in the list (moreover, we will offer the best option!). And you are able to access 213 coins & tokens, and get them directly to your wallet. To compare to a stock exchange, you pay both exchange and withdrawal fees.'},

      // partners section
      {lang: 'en', identifier: 'PARTNERS__SECTION__TITLE', phrase: 'Our partners'},

      // how it works section
      {lang: 'en', identifier: 'HOW_IT_WORKS__SECTION__TITLE', phrase: 'How it works'},

      {lang: 'en', identifier: 'HOW_IT_WORKS__ITEM__COMPARE__TITLE', phrase: 'Pick'},
      {lang: 'en', identifier: 'HOW_IT_WORKS__ITEM__COMPARE__CONTENT', phrase: 'Once you set the exchange pair, we do the rest: research, compare options and offer the best rates.'},

      {lang: 'en', identifier: 'HOW_IT_WORKS__ITEM__CONVERT__TITLE', phrase: 'Convert'},
      {lang: 'en', identifier: 'HOW_IT_WORKS__ITEM__CONVERT__CONTENT', phrase: 'Set coin pair and choose the exchange platform, fill in your wallet’s addresses, send crypto — and just wait.'},

      {lang: 'en', identifier: 'HOW_IT_WORKS__ITEM__TRACK__TITLE', phrase: 'Track'},
      {lang: 'en', identifier: 'HOW_IT_WORKS__ITEM__TRACK__CONTENT', phrase: 'You can track the status of your exchange via the direct link to operation on Block Explorer. Also, we provide accurate feedback during the whole operation on the very page.'},

      // seo text section
      {lang: 'en', identifier: 'SEO__SECTION__TITLE', phrase: 'Exchange cryptocurrency'},
      {lang: 'en', identifier: 'SEO__SECTION__CONTENT', phrase: `
The number of cryptocurrencies and methods of handling them are extremely diverse: at least, trading vs. holding-and-rebalancing approaches. As a rule, people exchange bitcoin and altcoins at a stock exchange, but if you are not a daytrader, the process becomes painful. A stock exchange requires registration. It is unsafe to store funds because there is no light wallet. You have to pay both exchange and withdrawal fees and there is no place where all the types of altcoins are listed. 

A smart solution to getting quick & safe access to various cryptos, and bypassing exchanges, is through a cryptoconverter. 

Allow us introduce Smartjex — a smart multiconverter which can exchange bitcoins or any crypto, calculates the best rates, and quickly send it directly to your wallet. Additionally, Smartjex offers a wider variety of altcoins because it is integrated through a set of trusty platforms.

We want Smartjex to ease your “cryptostory!”
      `},

      // reviews section
      {lang: 'en', identifier: 'REVIEWS__SECTION__TITLE', phrase: 'Reviews'},

    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Translations', null, {});
  }
};
