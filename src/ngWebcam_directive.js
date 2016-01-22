(function(angular) {

  var Directive = function ngWebcam() {

    var configs = {
      restrict: 'E',
      templateUrl: '/src/ngWebcam.html',
      controller: 'ngWebcamController',
      controllerAs: 'ngWebcam_vm',
      scope: {
        picture: '=',
        buttonClass: '@',
        format: '@'
      },
      bindToController: true,
      link: link
    };

    return configs;

    function link($scope, $element, $attr) {
      var canvas      = angular.element(document.querySelector('#canvas'))[0],
          video       = angular.element(document.querySelector('#video'))[0],
          buttonSnap  = angular.element(document.querySelector('#snap')),
          localStream = null,
          context     = canvas.getContext('2d');

      navigator.getUserMedia = navigator.getUserMedia    || navigator.webkitGetUserMedia ||
                               navigator.mozGetUserMedia || navigator.msGetUserMedia     ||
                               navigator.oGetUserMedia;

      if (navigator.getUserMedia) {
        navigator.getUserMedia({ video: true }, handleStream, handleStreamError);
      }

      function handleStream(stream) {
        localStream = stream;

        video.src = window.URL.createObjectURL(localStream);
        video.play();
      }

      function handleStreamError (err) {
        return console.error('Ops! There are some error when trying to capture video:', err.code);
      }

      function convertToImage(canvas) {
        var image     = new Image(),
            imgFormat = $scope.webcam_vm.format || 'image/png';

        image.src = canvas.toDataURL(imgFormat);

        return image;
      }

      buttonSnap.on('click', function($eventClickSnap) {
        var image = convertToImage(canvas);

        canvas.width = image.width;
        canvas.height = image.height;

        context.drawImage(video, 0, 0, image.width, image.height);

        $scope.webcam_vm.picture.set(image);
      });

      $scope.$on('$destroy', function($eventDestroy) {
        video.pause();
        video.src = '';

        if (localStream.getTracks() && localStream.getTracks()[0]) {
          localStream.getTracks()[0].stop();
        }
      });
    }
  };

  angular
  .module('ngWebcam')
  .directive('ngWebcam', Directive)
})(angular);
