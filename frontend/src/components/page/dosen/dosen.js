export const dosenConf = {
    data () {
        return {
            dosenMenu : [
            {
              path : '/dosen/'+this.$lcs.get('infoLogin').username,
              name : 'Beranda',
              icon : 'fa-home fa-fw',
              key : 1
              },
            {
              path : '/dosen/'+this.$lcs.get('infoLogin').username+'/ujian',
              name : 'Daftar Ujian',
              icon : 'fa-list-alt fa-fw',
              key : 2
            },
            {
              path : '/dosen/'+this.$lcs.get('infoLogin').username+'/kuliah',
              name : 'Daftar Kuliah',
              icon : 'fa-list-alt fa-fw',
              key : 3
            }
            ]
        }
    }
}
