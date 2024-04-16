cmake_minimum_required(VERSION 3.25.2)

project(TodoPoly LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED True)

set(RESOURCE_DIR ../build/res)
set(HAS_RESOURCES EXISTS ${GRESOURCES_DIR})

# LIB_INSTALL_DIR is set in prod build
# in debug build, we use CMAKE_CURRENT_BINARY_DIR as the LIB_INSTALL_DIR
# to simulate the install directory of the program which is usually /usr/lib64/${prog-name}
IF (NOT DEFINED LIB_INSTALL_DIR)
    set(LIB_INSTALL_DIR ${CMAKE_CURRENT_BINARY_DIR})
    set(APP_DIR ${LIB_INSTALL_DIR})

    message("Copying portable layer binary...")
    file(COPY_FILE ../build/bundle ${CMAKE_CURRENT_BINARY_DIR}/bundle)
ELSE()
    set(APP_DIR ${LIB_INSTALL_DIR}/TodoPoly)
ENDIF ()

# setup gtkmm
find_package(PkgConfig)
pkg_check_modules(GTKMM gtkmm-4.0)
link_directories(${GTKMM_LIBRARY_DIRS})
include_directories(${GTKMM_INCLUDE_DIRS})

# setup poly
add_subdirectory(lib/gtk-poly)

# compile resources
set(GRESOURCES_XML gresources.xml)
set(GRESOURCES_OUTPUT_SRC src/res.c)
set(GRESOURCES_OUTPUT_HEADER src/res.h)
set(GRESOURCES_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../res)
get_filename_component(GRESOURCES_DIR ${GRESOURCES_DIR} ABSOLUTE)

find_program(GLIB_COMPILE_RESOURCES NAMES glib-compile-resources REQUIRED)

IF (${HAS_RESOURCES})
    execute_process(
            WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
            COMMAND ${GLIB_COMPILE_RESOURCES} --generate-dependencies ${GRESOURCES_XML}
            OUTPUT_VARIABLE GRESOURCES_DEPS_REL
    )
    string(REPLACE "\n" " " GRESOURCES_DEPS_REL ${GRESOURCES_DEPS_REL})
    separate_arguments(GRESOURCES_DEPS_REL)
    set(GRESOURCES_DEPS "")
    foreach (DEP ${GRESOURCES_DEPS_REL})
        list(APPEND GRESOURCES_DEPS ${GRESOURCES_DIR}/${DEP})
    endforeach ()
    foreach (DEP ${GRESOURCES_DEPS})
        message("Resource detected: ${DEP}")
    endforeach ()

    add_custom_command(
            OUTPUT ${CMAKE_CURRENT_SOURCE_DIR}/${GRESOURCES_OUTPUT_SRC}
            WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
            COMMAND ${GLIB_COMPILE_RESOURCES}
            ARGS
            --generate-source
            --manual-register
            --sourcedir=${GRESOURCES_DIR}
            --target=${CMAKE_CURRENT_SOURCE_DIR}/${GRESOURCES_OUTPUT_SRC}
            ${GRESOURCES_XML}
            VERBATIM
            MAIN_DEPENDENCY ${GRESOURCES_XML}
            DEPENDS ${GRESOURCES_DEPS}
    )
    add_custom_command(
            OUTPUT ${CMAKE_CURRENT_SOURCE_DIR}/${GRESOURCES_OUTPUT_HEADER}
            WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
            COMMAND ${GLIB_COMPILE_RESOURCES}
            ARGS
            --generate-header
            --manual-register
            --sourcedir=${GRESOURCES_DIR}
            --target=${CMAKE_CURRENT_SOURCE_DIR}/${GRESOURCES_OUTPUT_HEADER}
            ${GRESOURCES_XML}
            VERBATIM
            MAIN_DEPENDENCY ${GRESOURCES_XML}
            DEPENDS ${GRESOURCES_DEPS}
    )

    add_custom_target(
            TodoPoly-resources
            DEPENDS
            ${CMAKE_CURRENT_SOURCE_DIR}/${GRESOURCES_OUTPUT_HEADER}
            ${CMAKE_CURRENT_SOURCE_DIR}/${GRESOURCES_OUTPUT_SRC})

    set_source_files_properties(
            ${CMAKE_CURRENT_SOURCE_DIR}/${GRESOURCES_OUTPUT_HEADER}
            ${CMAKE_CURRENT_SOURCE_DIR}/${GRESOURCES_OUTPUT_SRC}
            PROPERTIES GENERATED TRUE)
ENDIF ()

add_executable(TodoPoly
        src/main.cxx)

target_link_libraries(TodoPoly gtkpoly ${GTKMM_LIBRARIES})
IF (${HAS_RESOURCES})
    add_dependencies(TodoPoly TodoPoly-resources)
ENDIF ()
target_compile_definitions(TodoPoly PRIVATE APP_DIR=\"${APP_DIR}\")

install(TARGETS TodoPoly RUNTIME DESTINATION ${APP_DIR})
IF (EXISTS packaging/bundle)
    install(PROGRAMS packaging/bundle DESTINATION ${APP_DIR})
ELSE ()
    install(PROGRAMS ../build/bundle DESTINATION ${APP_DIR})
ENDIF ()
install(PROGRAMS packaging/launch.sh
        RENAME TodoPoly
        DESTINATION bin)
