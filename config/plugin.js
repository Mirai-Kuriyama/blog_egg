'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  valparams : {
    enable : true,
    package: 'egg-valparams'
  },
  // validate : {
  //   enable: true,
  //   package: 'egg-validate',
  // },
  jwt: {
    enable: true,
    package: "egg-jwt"
  },
  redis : {
    enable : true,
    package: 'egg-redis'
  },
  oss : {
    enable : true,
    package: 'egg-oss'
  },
  fullQiniu : {
    enable: true,
    package: 'egg-full-qiniu',
  }
};
