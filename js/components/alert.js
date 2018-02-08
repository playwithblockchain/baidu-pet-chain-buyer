var Alert = {
    Success: function(msg, seconds) {
        $('.alert-top-wrapper .alert-content').text(msg);
        $('.alert-top-wrapper .alert').removeClass('alert-danger').addClass('alert-success');
        $('.alert-top-wrapper').removeClass('alert-hide');

        if (seconds > 0) {
            Alert.DelayClose(seconds);
        }
    },

    Error: function(msg, seconds) {
        $('.alert-top-wrapper .alert-content').text(msg);
        $('.alert-top-wrapper .alert').removeClass('alert-success').addClass('alert-danger');
        $('.alert-top-wrapper').removeClass('alert-hide');

        if (seconds > 0) {
            Alert.DelayClose(seconds);
        }
    },

    Close: function() {
        $('.alert-top-wrapper .alert-content').text('');
        $('.alert-top-wrapper').addClass('alert-hide');
    },

    DelayClose: function(seconds) {
        setTimeout(function(){
            Alert.Close();
        }, seconds*1000);
    }
};