#include <gtkpoly/application.hxx>

int main()
{
    const Poly::ApplicationConfig config{
        .application_id = "org.polygui.TodoPoly",
        .app_dir_path = APP_DIR,
        .flags = Gio::Application::Flags::NONE,
    };
    const auto app = Poly::Application::create(config);

    return app->start();
}
