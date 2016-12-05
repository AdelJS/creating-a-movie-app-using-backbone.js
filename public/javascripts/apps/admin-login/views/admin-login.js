import Backbone from 'backbone';
import ModelView from '../../../lib/model-view';
import template from '../templates/login-form.pug';

export default ModelView.extend({
  template,
  className: 'row',
  events: {
    'click #login': 'login'
  },
  login: function (e) {
    e.preventDefault();
    $.ajax({
      url: 'admin/login',
      type: 'POST',
      dataType: 'json',
      data: {
        username: $('#username').val(),
        password: $('#password').val()
      },
      success: function ( data ) {
        window.location.replace = '/admin/pictures';
      }
    });
  }
});