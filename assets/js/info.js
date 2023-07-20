var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "infouser.html",
      controller: "myCtrl",
    })
    .when("/security", {
      templateUrl: "security.html",
      controller: "myCtrl",
    })
    .otherwise({
      redirectTo: "/",
    });
});

app.controller("myCtrl", function ($scope, $http) {
  $scope.signout = function () {
    localStorage.clear();
  };
  $scope.showSuccessWhenUpdateInfo = function () {
    bootstrap.showToast({
      body: "Cập nhật thông tin tài khoản thành công",
      toastClass: "text-bg-info",
      closeButtonClass: "btn-close-white",
      delay: 2000,
    });
  };
  $scope.showSuccessWhenChangePassword = function () {
    bootstrap.showToast({
      body: "Thay đổi mật khẩu thành công",
      toastClass: "text-bg-info",
      closeButtonClass: "btn-close-white",
      delay: 2000,
    });
  };
  $scope.updateInfo = function () {
    var regexEmail =
      /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    if (!regexEmail.test($scope.email)) {
      document
        .querySelector("#email")
        .setCustomValidity("Email không đúng định dạng");
    } else {
      const encryptedText = CryptoJS.MD5($scope.password).toString();
      $scope.load(encryptedText);
    }
  };
  $scope.checkSamePhone = function () {
    $http
      .get(
        "https://quiz-app-75e7a-default-rtdb.firebaseio.com/students/.json"
      )
      .then(function (response) {
        const students = Object.values(response.data);
        const targetStudent = students.find(
          (student) => student.email === $scope.email
        );
        if (targetStudent == undefined) {
          return true;
        } else {
          return false;
        }
      });
  };
  $scope.validateChangePassword = function () {
    $scope.id = JSON.parse(localStorage.getItem("data"));
    if ($scope.id != null) {
      $http
        .get(
          "https://quiz-app-75e7a-default-rtdb.firebaseio.com/students/" +
            $scope.id +
            ".json"
        )
        .then(function (response) {
          const encryptedText = CryptoJS.MD5(
            $scope.currentPassword
          ).toString();
          var newPassword = $scope.newPassword;
          var confirmPassword = $scope.confirmPassword;
          var regexPassword =
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/;
          if (encryptedText !== response.data.password) {
            document
              .querySelector("#currentPassword")
              .setCustomValidity("Mật khẩu cũ không đúng");
          } else if (!regexPassword.test(newPassword)) {
            document
              .querySelector("#newPassword")
              .setCustomValidity(
                "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt (@$!%*#?&) và phải có từ 8 đến 20 ký tự."
              );
          } else if (newPassword !== confirmPassword) {
            document
              .querySelector("#confirmPassword")
              .setCustomValidity("Mật khẩu không giống nhau");
          } else {
            $scope.showSuccessWhenChangePassword();
            var id = JSON.parse(localStorage.getItem("data"));
            $http
              .patch(
                "https://quiz-app-75e7a-default-rtdb.firebaseio.com/students/" +
                  id +
                  "/.json",
                {
                  password: CryptoJS.MD5($scope.newPassword).toString(),
                }
              )
              .then(function () {
                $scope.currentPassword = "";
                $scope.newPassword = "";
                $scope.confirmPassword = "";
              });
          }
        });
    }
  };
  $scope.validateUpdateInfo = function () {
    var phone = $scope.phone;
    var regexPhone = /^(0[35789][0-9]{8})$/;
    if (!regexPhone.test(phone)) {
      document
        .querySelector("#phone")
        .setCustomValidity("Số điện thoại không đúng định dạng");
    } else {
      $http
        .get(
          "https://quiz-app-75e7a-default-rtdb.firebaseio.com/students/.json"
        )
        .then(function (response) {
          const students = Object.values(response.data);
          const targetStudent = students.find(
            (student) =>
              student.email !== $scope.email &&
              student.phone === $scope.phone
          );
          if (targetStudent == undefined) {
            $scope.showSuccessWhenUpdateInfo();
            var id = JSON.parse(localStorage.getItem("data"));
            $http.patch(
              "https://quiz-app-75e7a-default-rtdb.firebaseio.com/students/" +
                id +
                "/.json",
              {
                fullname: $scope.fullname,
                phone: $scope.phone,
                birthday: $scope.birthday,
              }
            );
          } else {
            document
              .querySelector("#phone")
              .setCustomValidity("Số điện thoại đã tồn tại");
          }
        });
    }
  };
  $scope.loadData = function () {
    $scope.id = JSON.parse(localStorage.getItem("data"));
    if ($scope.id != null) {
      $http
        .get(
          "https://quiz-app-75e7a-default-rtdb.firebaseio.com/students/" +
            $scope.id +
            ".json"
        )
        .then(function (response) {
          $scope.image = response.data.image;
          $scope.username = response.data.username;
          $scope.email = response.data.email;
          $scope.fullname = response.data.fullname;
          $scope.phone = response.data.phone;
          $scope.birthday = new Date(response.data.birthday);
        });
    }
  };
  $scope.saveSubject = function (event) {
    var id = event.currentTarget.id;
    localStorage.setItem("quiz", JSON.stringify(id));
    window.open("../../quiz.html", "_self");
  };
});