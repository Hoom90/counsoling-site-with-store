export default {
  //#region User
  user: {
    firstName: (label) => [
      (v) => {
        if (v) return true;
        return `وارد کردن ${label ?? "نام"} الزامی است.`;
      },
    ],
    lastName: (label) => [
      (v) => {
        if (v) return true;
        return `وارد کردن ${label ?? "نام خانوادگی"} الزامی است`;
      },
    ],
    phoneNumber: (label) => [
      (v) => {
        if (v && v.length < 10) return `${label ?? "شماره همراه"} وارد شده معتبر نمیباشد`;
        if (v) return true;
        return `وارد کردن ${label ?? "شماره همراه"} الزامی است`;
      },
    ],
  },
  //#endregion

  //#region Expert
  expert: {
    firstName: [
      (value) => {
        if (value) return true;
        return "مقدار وارد شده اشتباه است.";
      },
    ],
    lastName: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    title: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    nationalCode: [
      (v) => {
        if (v && v.length < 10) return "کد ملی وارد شده معتبر نمیباشد";
        if (v) return true;
        return "وارد کردن کد ملی الزامی است";
      },
    ],
    medicalNumber: [
      (v) => {
        if (v) return true;
        return "وارد کردن کد نظام پزشکی الزامی است";
      },
    ],
    counselingAmount: (label) => [
      (v) => {
        if (v) return true;
        return `وارد کردن ${label??'قیمت کارشناسی'} الزامی است`;
      },
    ],
    categories: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    phoneNumber: [
      (v) => {
        if (/^0?9[0-9]{9}$/.test(v)) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    dateOfBirth: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    placeOfBirth: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    grade: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    gender: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    categoryIds: [
      (v) => {
        if (v && v.length > 0) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
  },
  //#endregion

  //#region Forum
  forum: {
    title: [
      (value) => {
        if (value) return true;
        return "مقدار وارد شده اشتباه است.";
      },
    ],
    categoryId: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    description: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
  },
  //#endregion

  //#region Article
  content: {
    title: [
      (v) => {
        if(v && v.length < 4) return "عنوان محتوا باید حداقل 4 کاراکتر باشد";
        if(v && v.length > 50) return "عنوان محتوا میتواند حداکثر 50 کاراکتر باشد";
        if (v) return true;
        return "وارد کردن عنوان محتوا الزامی است";
      },
    ],
    summery: [
      (v) => {
        if(v && v.length < 10) return "چکیده باید حداقل 10 کاراکتر باشد";
        if(v && v.length > 200) return "چکیده میتواند حداکثر 200 کاراکتر باشد";
        if (v) return true;
        return "وارد کردن چکیده الزامی است";
      },
    ],
    description: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    body: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    categoryId: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    imageId: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    price: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
    keywords: [
      (v) => {
        if (v) return true;
        return "حداقل یک کلید واژه الزامی است";
      },
    ],
    feature: [
      (v) => {
        if (v) return true;
        return "حداقل یک ویژگی الزامی است";
      },
    ],
    count: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
  },
  //#endregion

  //#region Category
  category: {
    title: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است.";
      },
    ],
    categoryId: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است.";
      },
    ],
  },
  //#endregion

  //#region Slider
  slider: {
    title: [
      (value) => {
        if (value) return true;
        return "مقدار وارد شده اشتباه است.";
      },
    ],
    imageId: [
      (v) => {
        if (v) return true;
        return "مقدار وارد شده اشتباه است";
      },
    ],
  },
  //#endregion

  //#region Slider
  province: {
    title: [
      (value) => {
        if (value) return true;
        return "مقدار وارد شده اشتباه است.";
      },
    ],
  },
  //#endregion

  //#region Result
  result: {
    title: [
      (value) => {
        if (value) return true;
        return "مقدار وارد شده اشتباه است.";
      },
    ],
  },
  //#endregion

  //#region Auth
  auth: {
    mobileNumber: [
      (value) => {
        if (value == "admin" || /^0?9[0-9]{9}$/.test(value)) return true;
        return "شماره وارد شده اشتباه است.";
      },
    ],
    oldPassword: [
      (v) => {
        if (v) return true;
        return "وارد کردن رمز قبلی الزامی است.";
      },
    ],
    newPassword: [
      (v) => {
        if (v) return true;
        return "وارد کردن رمز جدید الزامی است.";
      },
    ],
    repeatNewPassword: [
      (v) => {
        if (v) return true;
        return "وارد کردن تکرار رمز جدید الزامی است.";
      },
    ],
  },
  //#endregion
  ticket:{
    title: [
      value => {
        if (value) return true
        return 'موضوع تیکت خود را وارد کنید.'
      },
    ],
    department: [
      value => {
        if (value) return true
        return 'دپارتمان مورد نظر خود را وارد کنید.'
      },
    ],
    description: [
      value => {
        if (value) return true
        return 'متن تیکت خود را باید وارد کنید.'
      },
    ],
  }
};
