'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Reviews', [
      {
        url: 'https://twitter.com/CharlieShrem/status/835537948225454084',
        author: 'Charlie Shrem',
        comment: 'I love how @smartjex has no limits and awesome fees when going from crypto to crypto. No reason for exchanges!',
        post_date: '2017-02-25',
        sort: 1
      },
      {
        url: 'https://steemit.com/money/@borishaifa/thank-you-changelly-spasibo-changelly',
        author: 'Borishaifa',
        comment: '... I made my first transaction without memo. I was ready to say "Good-bye!", but wrote to Support... I got this answer: "Please, provide the hash of your payment, we\'ll try to push it manually...". And they really did it. They helped me get this transaction.',
        post_date: '2016-11-20',
        sort: 5
      },
      {
        url: 'https://bitcointalk.org/index.php?topic=1435275',
        author: 'Ryan Dugan',
        comment: 'Very professional and well Woking system. Very fast. Within minutes my transactions were on their way to my bitcoin wallet. Great job guys keep it coming!',
        post_date: '2016-11-13',
        sort: 2
      },
      {
        url: 'https://twitter.com/Programmarchy/status/813423970372325376',
        author: 'Donald Ness',
        comment: 'Had a flawless experience using @Changelly_team for some crypto trades this morning. Nice work guys.',
        post_date: '2017-01-16',
        sort: 3
      },
      {
        url: 'https://twitter.com/AscensionEnergy/status/882000322570465280',
        author: 'Kevin Courtois',
        comment: '...fees are reasonable and not loanshark level!',
        post_date: '2017-07-04',
        sort: 4
      },
      {
        url: 'https://steemit.com/cryptocurrency/@delusionalgenius/changelly-technical-support-is-nice-fast-awesome-and-honest',
        author: 'delusionalgenius',
        comment: 'Smartjex technical support is nice, fast, awesome, and honest.',
        post_date: '2017-10-28',
        sort: 6
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Reviews', null, {});
  }
};
