if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "C:/Users/Nguyen_Phat/.gradle/caches/8.11.1/transforms/c6407677777c5ebcea28eb6f3e0038d6/transformed/jetified-hermes-android-0.76.6-debug/prefab/modules/libhermes/libs/android.x86/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/Nguyen_Phat/.gradle/caches/8.11.1/transforms/c6407677777c5ebcea28eb6f3e0038d6/transformed/jetified-hermes-android-0.76.6-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

