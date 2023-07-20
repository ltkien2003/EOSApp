var app = angular.module("myApp", []);
app.controller("myCtrl", function ($scope, $http, $timeout) {
  $scope.questions = [];
  $scope.content;
  $scope.image;
  $scope.username;
  $scope.email;
  $scope.fullname;
  $scope.phone;
  $scope.birthday;
  $scope.reload = function () {
    $scope.id = JSON.parse(localStorage.getItem("data"));
    if ($scope.id != null) {
      window.open("../../has-login.html", "_self");
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
    } else {
      window.open("../../login.html", "_self");
    }
  };
  $scope.signout = function () {
    localStorage.clear();
  };
  $scope.showSuccessWhenCreateAccount = function () {
    bootstrap.showToast({
      body: "Đăng ký tài khoản thành công",
      toastClass: "text-bg-info",
      closeButtonClass: "btn-close-white",
      delay: 1000,
    });
  };
  $scope.showSuccessWhenSendContact = function () {
    bootstrap.showToast({
      body: "Chúng tôi đã ghi nhận phản hồi của bạn",
      toastClass: "text-bg-info",
      closeButtonClass: "btn-close-white",
      delay: 1000,
    });
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
  $scope.showFailWhenLogin = function () {
    bootstrap.showToast({
      body: "Tài khoản hoặc mật khẩu không hợp lệ",
      toastClass: "text-bg-danger",
      closeButtonClass: "btn-close-white",
      delay: 2000,
    });
  };
  $scope.showFailWhenSendContact = function () {
    bootstrap.showToast({
      body: "Gửi phản hồi thất bại",
      toastClass: "text-bg-danger",
      closeButtonClass: "btn-close-white",
      delay: 1000,
    });
  };
  $scope.hashPassword = function () {
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

  $scope.load = function (encryptedText) {
    $http
      .get("https://quiz-app-75e7a-default-rtdb.firebaseio.com/students/.json")
      .then(function (response) {
        const students = Object.values(response.data);
        const targetStudent = students.find(
          (student) =>
            student.password === encryptedText && student.email === $scope.email
        );
        const targetIndex = students.findIndex(
          (student) =>
            student.password === encryptedText && student.email === $scope.email
        );
        if (targetStudent == undefined) {
          $scope.showFailWhenLogin();
        } else {
          window.open("../../has-login.html", "_self");
          localStorage.setItem(
            "data",
            JSON.stringify(Object.keys(response.data)[targetIndex])
          );
        }
      });
  };
  $scope.checkSameEmail = function () {
    $http
      .get("https://quiz-app-75e7a-default-rtdb.firebaseio.com/students/.json")
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
  $scope.checkSamePhone = function () {
    $http
      .get("https://quiz-app-75e7a-default-rtdb.firebaseio.com/students/.json")
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
          const encryptedText = CryptoJS.MD5($scope.currentPassword).toString();
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
              student.email !== $scope.email && student.phone === $scope.phone
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
  $scope.validateFormSignup = function () {
    var email = $scope.email;
    var password = $scope.password;
    var confirmPassword = $scope.confirmPassword;
    var regexEmpty = /^\S+$/;
    var regexEmail =
      /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    var regexPassword =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/;
    if (!regexEmpty.test(email)) {
      document
        .querySelector("#email")
        .setCustomValidity("Email không được bỏ trống");
    } else if (!regexEmail.test(email)) {
      document
        .querySelector("#email")
        .setCustomValidity("Email không đúng định dạng");
    } else if (!regexPassword.test(password)) {
      document
        .querySelector("#password")
        .setCustomValidity(
          "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt (@$!%*#?&) và phải có từ 8 đến 20 ký tự."
        );
    } else if (password !== confirmPassword) {
      document
        .querySelector("#confirmPassword")
        .setCustomValidity("Mật khẩu không giống nhau");
    } else {
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
            $scope.add();
          } else {
            document
              .querySelector("#email")
              .setCustomValidity("Email đã tồn tại");
          }
        });
    }
  };
  $scope.sendingEmail = false;

  $scope.sendContact = function () {
    if ($scope.sendingEmail) {
      return;
    }
    $scope.sendingEmail = true;
    emailjs.init("id8D5e9CZNfIWD7mb");
    emailjs
      .send("service_d86r0oa", "template_57h8klf", {
        fullname: $scope.fullname,
        from_email: $scope.email,
        subject: $scope.subject,
        message: $scope.message,
      })
      .then(function () {
        $scope.subject = "";
        $scope.message = "";
        $scope.$apply();
        $scope.showSuccessWhenSendContact();
      })
      .catch(function (error) {
        $scope.showFailWhenSendContact();
      })
      .finally(function () {
        $scope.sendingEmail = false;
      });
  };

  $scope.add = function () {
    const encryptedText = CryptoJS.MD5($scope.password).toString();
    var newItem = {
      email: $scope.email,
      password: encryptedText,
      username: $scope.email.split("@")[0],
      fullname: "",
      phone: "",
      birthday: "2023-01-01",
      image:
        "data:image/png;base64,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",
    };

    $http
      .post(
        "https://quiz-app-75e7a-default-rtdb.firebaseio.com/students/.json",
        newItem
      )
      .then(function (response) {
        $scope.showSuccessWhenCreateAccount();
        $timeout(() => {
          window.open("../../login.html", "_self");
        }, 1000);
      });
  };
  $scope.saveSubject = function (event) {
    var id = event.currentTarget.id;
    localStorage.setItem("quiz", JSON.stringify(id));
    window.open("../../quiz.html", "_self");
  };
});
app.controller("myCtrl1", function ($scope, $http, $timeout, $interval) {
  $scope.showSubmitExam = function (point) {
    bootstrap.showToast({
      body: "Số điểm của bạn đạt được là: " + point + " điểm",
      toastClass: "text-bg-info",
      closeButtonClass: "btn-close-white",
      delay: 2000,
    });
    $timeout(() => {
      window.open("../../has-login.html", "_self");
    }, 2000);
  };
  $scope.showTimeout = function () {
    bootstrap.showToast({
      body: "Hết giờ",
      toastClass: "text-bg-danger",
      closeButtonClass: "btn-close-white",
      delay: 1000,
    });
    $timeout(() => {
      window.open("../../has-login.html", "_self");
    }, 2000);
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
    } else {
      window.open("../../login.html", "_self");
    }
  };
  $scope.selectedAnswer = [];
  $scope.listAnswer = {};
  $scope.userAnswers = {};

  $scope.saveAnswer = function (questionId, answer) {
    $scope.userAnswers[questionId] = answer;
  };
  $scope.score = 0;
  $scope.getPoint = async function () {
    const size = Object.keys($scope.userAnswers).length;
    const promises = [];
    let correctAnswersCount = 0;

    for (let index = 0; index < size; index++) {
      const promise = $http.get(
        'https://quiz-app-75e7a-default-rtdb.firebaseio.com/answer.json?orderBy="question_id"&equalTo=' +
          Object.keys($scope.userAnswers)[index]
      );
      promises.push(promise);
    }

    const responses = await Promise.all(promises);
    const answers = responses.map(
      (response) => Object.values(response.data)[0].content
    );
    for (let index = 0; index < size; index++) {
      if (
        answers[index] ===
        $scope.userAnswers[Object.keys($scope.userAnswers)[index]]
      ) {
        correctAnswersCount++;
      }
    }

    $scope.showSubmitExam(correctAnswersCount);
  };
  $scope.timer = function () {
    $scope.timeLeft = 5 * 60;
    var countdownInterval;
    var isTimeUp = false;
    $scope.countdown = function () {
      if (!isTimeUp) {
        $scope.timeLeft = $scope.timeLeft - 1;
        if ($scope.timeLeft === 0) {
          isTimeUp = true;
          $interval.cancel(countdownInterval);
          $scope.showTimeout();
          $timeout(() => {
            window.open("../../has-login.html", "_self");
          }, 1000);
        }
      }
    };

    $interval($scope.countdown, 1000);

    $scope.timeLeftInMinutes = function () {
      return Math.floor($scope.timeLeft / 60);
    };

    $scope.timeLeftInSeconds = function () {
      return $scope.timeLeft % 60;
    };
  };
  $scope.loadQuestions = function () {
    $scope.subject = JSON.parse(localStorage.getItem("quiz"));
    if ($scope.subject != null) {
      $http
        .get(
          'https://quiz-app-75e7a-default-rtdb.firebaseio.com/questions.json?orderBy="subject_id"&equalTo="' +
            $scope.subject +
            '"'
        )
        .then(function (response) {
          $scope.questions = response.data;
        });
    }
  };
  $scope.timer();
});
