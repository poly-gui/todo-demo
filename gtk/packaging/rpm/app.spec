Name:           TodoPoly
Version:        1.0.0
Release:        1%{?dist}
Summary:        An application made with Poly.

License:        GPLv3+
URL:            https://www.example.com/%{name}
Source0:        https://www.example.com/%{name}/releases/%{name}-%{version}.tar.gz

BuildRequires:  cmake ninja-build

%description
An application made with Poly.

%prep
%setup -q

%build
%cmake
%cmake_build

%install
%cmake_install


%files
%{_bindir}/%{name}
%dir %{_libdir}/%{name}

%changelog
- Initial
