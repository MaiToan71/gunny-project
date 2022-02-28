var ViewModel = function () {
    var self = this;
    self.convertToKoObject = function (data) {
        var newObj = ko.mapping.fromJS(data);
        return newObj;
    }
    self.convertToJson = function (item) {
        if (item == null || item == "") {
            return [];
        } else {
            return JSON.parse(item);
        }
    };
    self.modalAdd = function () {
        const d = new Date();
        var month = d.getMonth() + 1;
        if (month < 10) {
            month = '0' + month
        }
        var date = d.getDate();
        if (date < 10) {
            date = '0' + date
        }
        $('#date-input').val(`${d.getFullYear()}-${month}-${date}`)
        $('#add').modal('show');
    }
    self.addToDatabase = function () {
        var obj = {
            Day: $('#date-input').val().split('-')[2],
            Year: $('#date-input').val().split('-')[0],
            Month: $('#date-input').val().split('-')[1],
            Date: $('#date-input').val(),
            CardinalNumber: $('#date-input').val().split('-').join('')
        }
        $.ajax({
            url: "/api/Date/add",
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(obj),
            success: function (data) {
                self.getLists();
                if (data == true) {
                    $('#add').modal('hide');
                    toastr.success("Bạn đã thêm mới một trường dữ liệu", "Thành công!");
                } else {
                    toastr.error("đã tồn tại dữ liệu ngày " + $('#date-input').val(), "Có lỗi!")
                }
            },
            error: function (error) {
                toastr.error(error, "Có lỗi!")
            }
        });
    }
    self.data = ko.observableArray();
    self.getLists = function () {
        var obj = {
            Page: 0,
            Size: 20
        }
        $.ajax({
            url: "/api/Date/all",
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(obj),
            success: function (data) {
                self.data([]);
                $.each(data, function (ex, item) {
                    self.data.push(self.convertToKoObject(item));
                })
            },
            error: function (error) {
                toastr.error(error, "Có lỗi!")
            }
        });
    }

}
$(function () {
    var viewModel = new ViewModel();
    viewModel.getLists();
    ko.applyBindings(viewModel, document.getElementById('home-index'));
});